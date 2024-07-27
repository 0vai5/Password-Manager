const WebInput = document.getElementById('web');
const EmailInput = document.getElementById('email');
const PassInput = document.getElementById('password');
const btn = document.getElementById('save');
const tbody = document.getElementById('TableBody');
const form = document.getElementsByTagName('form')[0];

const noDataRow = document.createElement('tr');
noDataRow.innerHTML = `<td colspan="4">No Data Found</td>`;

let passwords = JSON.parse(localStorage.getItem('passwords')) || [];

function updateTable(passwords) {
    tbody.innerHTML = '';

    if (passwords.length === 0) {
        tbody.appendChild(noDataRow);
    } else {
        passwords.forEach((entry, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${entry.web}</td>
                <td>${entry.email}</td>
                <td>${entry.password}</td>
                <td><button class="btn delete-btn" id="delete"  data-index="${index}">Delete</button></td>
            `;
            tbody.appendChild(row);
        });
    }
}

updateTable(passwords);

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const web = WebInput.value.trim();
    const email = EmailInput.value.trim();
    const password = PassInput.value.trim();

    if (!web || !email || !password) {
        alert('All fields are required.');
        return;
    }

    let webModified;
    try {
        if (!/^https?:\/\//i.test(web)) {
            webModified = 'https://' + web;
        } else {
            webModified = web;
        }
        new URL(webModified);
    } catch (e) {
        alert('Invalid website URL.');
        return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        alert('Invalid email address.');
        return;
    }

    const newPassword = {
        web: webModified,
        email,
        password
    };

    passwords.push(newPassword);
    localStorage.setItem('passwords', JSON.stringify(passwords));
    updateTable(passwords);

    WebInput.value = '';
    EmailInput.value = '';
    PassInput.value = '';
});

tbody.addEventListener('click', (e) => {
    if (e.target && e.target.classList.contains('delete-btn')) {
        const index = e.target.getAttribute('data-index');
        passwords.splice(index, 1);
        localStorage.setItem('passwords', JSON.stringify(passwords));
        updateTable(passwords);
    }
});
