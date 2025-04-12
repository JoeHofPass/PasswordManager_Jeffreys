document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");
    const passwordPopup = document.getElementById("passwordPopup");
    const accounts = document.getElementById("accountList");
    const deletePassword = document.getElementById("delete-confirmation");
    const pinCheck = document.getElementById("pin-form");
    const restorePassword = document.getElementById("restore-confirmation");

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
            } else {
                console.log("Login failed!");
            }
        });
    }

    if (pinCheck) {
        document.getElementById("verifypinbtn").addEventListener("click", (event) => {
            event.preventDefault();
            const current = localStorage.getItem("currentUserEmail");

            const pin = document.getElementById("pin-input").value;

            if (!window.electron) {
                console.error("Electron API not found!");
                return;
            }
            window.electron.send("pin", { email: current, pin });

        });
        window.electron.on("pin-response", (response) => {
            if (response.status === "success") {
                console.log("pin successful!");
                closePinModal();
                openEditWindow(currentPasswordId);
            } else {
                console.log("pin failed!");
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
            const pin = document.getElementById("pin").value;

            if (password !== confirmPassword) {
                console.error("Passwords do not match! Please try again.");
                return;
            }
            if (!window.electron) {
                console.error("Electron API not found!");
                return;
            }
            window.electron.send("register", { fullname, email, password, pin });
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
    if(deletePassword){
        document.getElementById("deletepassbtn").addEventListener("click", (event) => {
            event.preventDefault();
            const email = localStorage.getItem("currentUserEmail");
            const zeroORone = "0";
            const card = document.querySelector(`.password-box[data-id="${currentPasswordId}"]`);
            const serviceName = card?.querySelector("h4")?.innerText;
            if (!window.electron) {
                console.error("Electron API not found!");
                return;
            }
            window.electron.send("restoreORdelete", { email, serviceName, zeroORone});
            //console.log(typeof(email),typeof(serviceName),typeof(zeroORone));
        });
        window.electron.on("restoreORdelete-response", (response) => {
            //console.log("restoreORdelete-response:", response);

            if(response === "success"){
                deletePasswordConfirmed();
            }else {
                console.log("Failed to delete password");
            }
        });
    }

    if(restorePassword){
        document.getElementById("confirmBtn").addEventListener("click", (event) => {
            event.preventDefault();
            const email = localStorage.getItem("currentUserEmail");
            const zeroORone = "1";
            const card = document.querySelector(`.password-box[data-id="${currentPasswordId}"]`);
            const serviceName = card?.querySelector("h4")?.innerText;
            if (!window.electron) {
                console.error("Electron API not found!");
                return;
            }
            window.electron.send("restoreORdelete", { email, serviceName, zeroORone});
            //console.log(typeof(email),typeof(serviceName),typeof(zeroORone));
        });
        window.electron.on("restoreORdelete-response", (response) => {
            //console.log("restoreORdelete-response:", response);
            if(response === "success"){
                recoverPassword();
            }else {
                console.log("Failed to restore password");
            }
        });
    }

    if (accounts) {
        const current = localStorage.getItem("currentUserEmail");
        window.electron.send("get-passwords", { email: current });

        window.electron.on("get-passwords-response", (passwords) => {
            //console.log("Listening for get-password-response");
            const accountList = document.getElementById("accountList");
            //console.log("recieved passwords:", passwords);
            passwords.forEach(password => {
                let domain = password.service.toLowerCase().replace(/\s+/g, "");
                if (!domain.includes(".")) {
                    domain += ".com";
                }
                const logoURL = `https://logo.clearbit.com/${domain}`;
                const id = Date.now(); // simple unique ID

                const newAccount = document.createElement("div");
                newAccount.classList.add("password-box");
                newAccount.setAttribute("data-id", id);
                newAccount.style.position = "relative";

                newAccount.innerHTML = `
                     <div class="icon-row">
                        <i class="fas fa-pencil-alt edit-icon" title="Edit password" onclick="promptPin('edit', '${id}')"></i>
                        <i class="fas fa-trash-alt delete-icon" title="Delete password" onclick="confirmDelete('${id}')"></i>
                    </div>
                    <h4>${password.service}</h4>
                    <p>${password.username}</p>
                    <img src="${logoURL}" class="site-logo" onerror="this.onerror=null;this.src='onErrorIcon.png';" />
                    <p class="password-field" data-real-password="${password.password}" data-visible="false">••••••••••••</p>
                    <button class="toggle-password" onclick="togglePasswordVisibility(this.previousElementSibling, this)">
                        <i class="fas fa-eye"></i>
                    </button>
                `;
                accountList.appendChild(newAccount);
            });
        });
    }
})