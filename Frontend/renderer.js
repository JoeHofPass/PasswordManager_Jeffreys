
const { ipcRenderer } = require('electron');
document.getElementById('login-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    ipcRenderer.send('login', { email, password });
});

ipcRenderer.on('login-response', (event,response) => {
    if(response=='success'){
        window.location.href= 'home.html';
    } else {
        alert('Invalid email or password');
    }
});;