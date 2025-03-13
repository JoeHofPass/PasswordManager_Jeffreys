document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");
    
    if(loginForm) {
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
    }
    
    if (registerForm){
        document.getElementById("register-form").addEventListener("submit", (event) => {
            event.preventDefault();
        
            const fullname = document.getElementById("fullname").value;
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;
            const confirmPassword = document.getElementById("confirm-password").value;
        
            if (password !== confirmPassword) {
                console.error("Passwords do not match! Please try again.");
                return;
            }
            if (!window.electron) {
                console.error("Electron API not found!");
                return;
            }
            console.log("sending data to main");
            window.electron.send("register", { fullname, email, password });
        });
        
        window.electron.on("register-response", (response) => {
            if (response === "success") {
                console.log("Registration successful!");
                window.location.href = "login.html";
            } else {
                console.log("Registration failed!");
            }
        });
    }
})