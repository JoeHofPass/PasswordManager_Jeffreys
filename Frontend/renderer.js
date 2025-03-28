document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");
    const passwordPopup = document.getElementById("passwordPopup");
    const accounts = document.getElementById("accountList");

    const current = localStorage.getItem("currentUserEmail");
    if (current && accounts) {
        window.electron.send("get-passwords", { email: current });
    }

    if (loginForm) {
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
            if (response.status === "success") {
                console.log("Login successful!");
                const email = document.getElementById("email").value;
                localStorage.setItem("currentUserEmail", email);
                localStorage.setItem("currentUsername", response.fullname);
                window.location.href = "home.html";
                // window.electron.send("get-passwords", { email });

            } else {
                console.log("Login failed!");
            }
        });
    }

    if (registerForm) {
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

    if (passwordPopup) {
        document.getElementById("savepassbtn").addEventListener("click", (event) => {
            event.preventDefault();
            const email = localStorage.getItem("currentUserEmail");
            const serviceName = document.getElementById("siteName").value;
            const serviceUsername = document.getElementById("userEmail").value;
            const servicePassword = document.getElementById("generatedPassword").value;

            if (!window.electron) {
                console.error("Electron API not found!");
                return;
            }
            window.electron.send("store-password", { email, serviceName, serviceUsername, servicePassword });
        });
        window.electron.on("storePassword-response", (response) => {
            if (response === "success") {
                console.log("Password successfully stored!");
                closePasswordPopup();
            } else {
                console.log("Failed to add new password.");
            }
        });
    }

    if (accounts) {
        window.electron.on("get-passwords-response", (passwords) => {
            console.log("Listening for get-password-response");
            const accountList = document.getElementById("accountList");
            console.log("recieved passwords:", passwords);
            accountList.innerHTML = "";
            passwords.forEach(password => {
                let domain = password.service.toLowerCase().replace(/\s+/g, "");
                if (!domain.includes(".")) {
                    domain += ".com";
                }

                const logoURL = `https://logo.clearbit.com/${domain}`;
                const accountCard = document.createElement("div");
                accountCard.classList.add("account-card");

                accountCard.innerHTML = `
            <img src="${logoURL}" onerror="this.onerror=null;this.src='default_logo.png';" alt="${password.service}" class="site-logo" />
            <div class="account-info">
                <strong>${password.service}</strong>
                <p>${password.username}</p>
                <div class="password-container">
                    <input type="password" value="${password.password}" class="password-field" readonly />
                    <button class="toggle-password" onclick="togglePassword(this)">👁</button>
                </div>
            </div>
        `;
                accountList.appendChild(accountCard);
            });
        });
    } else {
        console.log("No passwords to display.");
    }
})