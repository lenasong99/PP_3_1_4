
const url = 'http://localhost:8484/api/admins/';

function getAllUsers() {
    fetch(url)
        .then(res => res.json())
        .then(data => {
            show(data)
        })
}
function show(allUsers) {
    let res = '';
    for (let user of allUsers) {
        res +=
            `<tr>
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.surname}</td>
                <td>${user.age}</td>
                 <td>${user.username}</td>
                 <td>${user.roles.map(r => r.name.replace('ROLE_', '')).join(' ')}</td>
                  <td>
                        <button type="button" class="btn btn-info"
                         data-toggle="modal" data-target="#edit-modal" onclick="editModal(${user.id})">Edit</button>
                    </td>
                    <td>
                        <button type="button"  data-action="delete" class="btn btn-danger"
                        data-toggle="modal" data-target="#delete-modal" onclick="deleteModal(${user.id})">Delete</button>
                    </td>
            </tr>`
    }
    document.getElementById('users-table').innerHTML = res;

}

fetch(url)
    .then(response => response.json())
    .then(data => show(data))
    .catch(error => console.log(error))


function closeModal() {
    document.querySelectorAll(".close").forEach((btn) => btn.click())
}

function editModal(id) {
    let editId =url +'users/' + id;
    fetch(editId, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=UTF-8'
        }
        }).then(res => {
            res.json().then(user => {
                document.getElementById('edit-id').value = user.id;
                document.getElementById('edit-name').value = user.name;
                document.getElementById('edit-surname').value = user.surname;
                document.getElementById('edit-age').value = user.age;
                document.getElementById('edit-username').value = user.username;
                document.getElementById('edit-password').value = user.password;
                document.getElementById('edit-role').value = user.role;
            })
    });
}
let editRole = document.querySelector('#edit-role').selectedOptions
async function editUser() {
    let idValue = document.getElementById('edit-id').value;
    let nameValue = document.getElementById('edit-name').value;
    let surnameValue = document.getElementById('edit-surname').value;
    let ageValue = document.getElementById('edit-age').value;
    let usernameValue = document.getElementById('edit-username').value;
    let passwordValue = document.getElementById('edit-password').value;
    let method = {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=UTF-8'
        },
        body: JSON.stringify({
            id: idValue,
            name: nameValue,
            surname: surnameValue,
            age: ageValue,
            username: usernameValue,
            password: passwordValue,
            roles: Array.from(document.getElementById('edit-role').selectedOptions)
                .map(option => ({
                    id: option.value,
                    name: 'ROLE_' + option.text
                }))
        })
    }
    let urlEdit = url + 'users/' + idValue
    await fetch(urlEdit, method).then(() => {
        closeModal();
        getAllUsers();
    })
}

function deleteModal(id) {
    let deleteId =url +'users/' + id;
    fetch(deleteId, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=UTF-8'
        }
    }).then(res => {
        res.json().then(user => {
            document.getElementById('delete-id').value = user.id;
            document.getElementById('delete-name').value = user.name;
            document.getElementById('delete-surname').value = user.surname;
            document.getElementById('delete-age').value = user.age;
            document.getElementById('delete-username').value = user.username;
            document.getElementById('delete-password').value = user.password;
        })
    });
}
async function deleteUser() {
    const id = document.getElementById('delete-id').value
    let urlDelete = url + 'users/' + id;

    let method = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    }
    fetch(urlDelete, method).then(() => {
        closeModal();
        getAllUsers();
    })
}
let newRole = document.querySelector('#rolesCreate').selectedOptions
function newUserTab() {
    document.getElementById('newUserForm').addEventListener('submit', (e) => {
        e.preventDefault()
        fetch(url + 'new', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({
                name: document.getElementById('nameNew').value,
                surname: document.getElementById('surnameNew').value,
                age: document.getElementById('ageNew').value,
                username: document.getElementById('usernameNew').value,
                password: document.getElementById('passwordNew').value,
                roles: Array.from(document.getElementById('rolesCreate').selectedOptions)
                    .map(option => ({
                        id: option.value,
                        name: 'ROLE_' + option.text
                    }))
            })
        })
            .then((response) => {
                if (response.ok) {
                    document.getElementById('nameNew').value = '';
                    document.getElementById('surnameNew').value = '';
                    document.getElementById('ageNew').value = '';
                    document.getElementById('usernameNew').value = '';
                    document.getElementById('passwordNew').value = '';
                    document.getElementById('rolesCreate').value = '';
                    document.getElementById('allUsers').click()
                    getAllUsers();
                }
            })
    })
}