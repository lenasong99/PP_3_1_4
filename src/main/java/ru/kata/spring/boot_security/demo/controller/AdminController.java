package ru.kata.spring.boot_security.demo.controller;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.repositories.RoleRepository;
import ru.kata.spring.boot_security.demo.service.UserService;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.Set;

@Controller
@RequestMapping("/admin")
public class AdminController {
    private final UserService userService;
    private final RoleRepository roleRepository;
    @Autowired
    public AdminController(UserService userService, RoleRepository roleRepository) {
        this.userService = userService;
        this.roleRepository = roleRepository;
    }

    @GetMapping("")
    public String showAllUsers(Model model) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User thisUser = userService.findByUsername(auth.getName());
        model.addAttribute("thisUser", thisUser);
        model.addAttribute("allUsers", userService.getAllUsers());
        model.addAttribute("roles", roleRepository.findAll());
        model.addAttribute("newUser", new User());
        return "all-users";
    }

   @PostMapping("/new")
    public String newUser(@ModelAttribute("user") User user, @RequestParam(value = "role") String[] roles) {
       user.setRoles(getRoles(roles));
       userService.saveUser(user);
       return "redirect:/admin";
   }
    public Set<Role> getRoles(String[] roles) {
        Set<Role> roleSet = new HashSet<>();
        for (String role : roles) {
            roleSet.add(roleRepository.findByName(role));
        }
        return roleSet;
    }

    @PostMapping("/update")
    public String updateUser(@ModelAttribute("user") User user, @RequestParam(value = "role") String[] roles) {
        user.setRoles(getRoles(roles));
        userService.saveUser(user);
        return "redirect:/admin";
    }
    @RequestMapping("/delete-user")
    public String deleteUser(@RequestParam("id") int id) {
        userService.deleteUser(id);
        return "redirect:/admin";
    }
}
