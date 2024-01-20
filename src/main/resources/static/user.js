const userUrl = 'http://localhost:8484/api/admins/userAuth';


function getPage() {
    fetch(userUrl)
        .then(response => response.json())
        .then(user => {
            getInformation(user)
        })
}

function getInformation(user) {

    document.getElementById('userInfo').innerHTML = `<tr>
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.surname}</td>
            <td>${user.age}</td>
            <td>${user.username}</td>
            <td>${user.roles.map(r => r.name.replace('ROLE_', '')).join(' ')}</td>
        </tr>`;

}

getPage();