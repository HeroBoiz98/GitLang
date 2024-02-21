document.getElementById('languageInput').addEventListener('input', function() {
    const languages = this.value.trim().toLowerCase().split(' ').filter(language => language !== '');
    if (languages.length === 0) {
        clearUserList();
        return;
    }

    const apiUrl = `https://api.github.com/search/repositories?q=${languages.map(language => `language:${language}`).join('+')}&sort=stars&order=desc`;

    fetch(apiUrl, {
        headers: {
            'Authorization': 'token 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' // Your access token
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch users. Status: ' + response.status);
        }
        return response.json();
    })
    .then(data => {
        const users = data.items.map(item => item.owner);
        getUsersData(users);
    })
    .catch(error => {
        console.error('Error fetching users:', error);
        // Handle the error gracefully, e.g., display a user-friendly message
        document.getElementById('userList').innerHTML = '<p>Failed to fetch users. Please try again later.</p>';
    });
});

function getUsersData(users) {
    Promise.all(users.map(user => fetch(user.url, {
        headers: {
            'Authorization': 'token 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' // Your access token
        }
    }).then(response => response.json())))
    .then(usersData => {
        displayUsers(users, usersData);
    })
    .catch(error => {
        console.error('Error fetching users data:', error);
        // Handle the error gracefully, e.g., display a user-friendly message
        document.getElementById('userList').innerHTML = '<p>Failed to fetch user data. Please try again later.</p>';
    });
}

function displayUsers(users, usersData) {
    const userList = document.getElementById('userList');
    userList.innerHTML = '';

    if (users.length === 0) {
        userList.innerHTML = '<p>No users found.</p>';
    } else {
        const ul = document.createElement('ul');
        ul.classList.add('user-profile-list');

        users.forEach((user, index) => {
            const li = document.createElement('li');
            li.classList.add('user-profile');

            const link = document.createElement('a');
            link.href = user.html_url;
            link.textContent = user.login;

            const avatar = document.createElement('img');
            avatar.src = user.avatar_url;
            avatar.alt = `${user.login}'s avatar`;
            avatar.classList.add('avatar');

            const followers = document.createElement('span');
            followers.textContent = `Followers: ${usersData[index].followers}`;

            const location = document.createElement('span');
            location.textContent = `Location: ${usersData[index].location}`;

            li.appendChild(avatar);
            li.appendChild(link);
            li.appendChild(followers);
            li.appendChild(location);
            ul.appendChild(li);
        });

        userList.appendChild(ul);
    }
}

function clearUserList() {
    document.getElementById('userList').innerHTML = '';
}
