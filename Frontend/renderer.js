document.getElementById("login-form").addEventListener("submit", (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (!window.electron) {
        console.error("Electron API not found!");
        return;
    }

    window.electron.send("login", { email, password });
});
window.electron.on("login-response", (response) => {
    if (response === "success") {
        console.log("Login successful!");
        window.location.href = "home.html";
    } else {
        console.log("Login failed!");
    }
});


// ipcRenderer.on('login-response', (event,response) => {
//     if(response=='success'){
//         window.location.href= 'home.html';
//     } else {
//         alert('Invalid email or password');
//     }
// });;