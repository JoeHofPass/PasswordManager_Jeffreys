// FINAL CORRECTED renderer.js
window.currentAction = null;

document.addEventListener("DOMContentLoaded", () => {
<<<<<<< Updated upstream
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
=======
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");
  const passwordPopup = document.getElementById("passwordPopup");
  const accounts = document.getElementById("accountList");
  const deletePassword = document.getElementById("delete-confirmation");
  const pinForm = document.getElementById("pin-form");
  const restorePassword = document.getElementById("restore-confirmation");
  const fileBtn = document.getElementById("selectFile");
  const fileInput = document.getElementById("fileInput");
  const pinStatus = document.getElementById("pin-status");

  const restoreBtn = document.getElementById("confirmBtn");
  if (restoreBtn) {
    restoreBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const email = localStorage.getItem("currentUserEmail");
      const password_id = localStorage.getItem("currentPasswordId");
      const zeroORone = "1"; // restore
      if (!email || !password_id || !window.electron) return;
      window.electron.send("restoreORdelete", {
        email,
        password_id,
        zeroORone,
      });
    });
  }
>>>>>>> Stashed changes

  window.deletePasswordConfirmed = function () {
    const id = localStorage.getItem("currentPasswordId");
    const card = document.querySelector(`.password-box[data-id="${id}"]`);
    if (card) card.remove();
    closeDeleteModal();
    localStorage.removeItem("currentPasswordId");
  };

<<<<<<< Updated upstream
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
=======
  document.body.addEventListener("click", (e) => {
    const anchor = e.target.closest("a.external-link");
    if (anchor) {
      e.preventDefault();
      const targetUrl = anchor.getAttribute("data-href");
      window.electron?.openExternal?.(targetUrl) ||
        window.open(targetUrl, "_blank");
    }
  });

  if (loginForm) {
    loginForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      document.getElementById("loading-overlay")?.classList.remove("hidden");
      window.electron.send("login", { email, password });
    });

    window.electron.removeAllListeners("login-response");
    window.electron.on("login-response", (response) => {
      document.getElementById("loading-overlay")?.classList.add("hidden");
      if (response.status === "success") {
        localStorage.setItem(
          "currentUserEmail",
          document.getElementById("email").value
        );
        localStorage.setItem("currentUsername", response.fullname);
        window.location.href = "home.html";
      } else {
        alert("Login failed. Check credentials.");
      }
    });
  }

  if (pinForm) {
    pinForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const pin = document.getElementById("pin-input").value.trim();
      const email = localStorage.getItem("currentUserEmail");

      pinStatus.className = "pin-status hidden";
      pinStatus.textContent = "";

      if (!pin) {
        pinStatus.textContent = "Please enter a PIN.";
        pinStatus.className = "pin-status error";
        return;
      }

      window.electron.send("verify-pin", { email, pin });
    });

    window.electron.removeAllListeners("verify-pin-response");
    window.electron.on("verify-pin-response", (response) => {
      pinStatus.classList.remove("hidden");
      if (response.status === "success") {
        pinStatus.className = "pin-status success";
        pinStatus.textContent = "✅ Access granted!";
        setTimeout(() => {
          document.getElementById("pin-modal").classList.add("hidden");
          pinStatus.classList.add("hidden");
          pinStatus.textContent = "";
          switch (window.currentAction) {
            case "access-deleted":
              window.location.href = "deletedPasswords.html";
              break;
            case "edit":
              window.openEditWindow(localStorage.getItem("currentPasswordId"));
              break;
            case "delete":
              window.deletePasswordConfirmed();
              break;
            case "unlock":
              document.body.classList.remove("locked");
              break;
          }
          window.currentAction = null;
        }, 800);
      } else {
        pinStatus.className = "pin-status error";
        pinStatus.textContent = "❌ Incorrect PIN. Try again.";
      }
    });
  }

  if (registerForm) {
    registerForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const fullname = document.getElementById("fullname").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      const confirmPassword = document.getElementById("confirm-password").value;
      const pin = document.getElementById("pin").value;

      if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
      }

      window.electron.send("register", { fullname, email, password, pin });
      document.getElementById("loading-overlay")?.classList.remove("hidden");
    });

    window.electron.removeAllListeners("register-response");
    window.electron.on("register-response", (response) => {
      document.getElementById("loading-overlay")?.classList.add("hidden");
      if (response === "success") {
        alert("Registration successful!");
        window.location.href = "login.html";
      } else {
        alert("Registration failed.");
      }
    });
  }

  if (passwordPopup) {
    document
      .getElementById("savepassbtn")
      ?.addEventListener("click", (event) => {
        event.preventDefault();
        const email = localStorage.getItem("currentUserEmail");
        const serviceName = document.getElementById("siteName").value.trim();
        const serviceUsername = document
          .getElementById("userEmail")
          .value.trim();
        const servicePassword = document
          .getElementById("generatedPassword")
          .value.trim();

        if (!email || !serviceName || !serviceUsername || !servicePassword) {
          alert("All fields must be filled.");
          return;
        }

        let password_id = localStorage.getItem("currentPasswordId");
        if (!password_id) {
          password_id = crypto.randomUUID();
        }

        window.electron.send("store-password", {
          email,
          serviceName,
          serviceUsername,
          servicePassword,
          password_id,
        });

        localStorage.removeItem("currentPasswordId");
        closePasswordPopup();
      });

    window.electron.removeAllListeners("storePassword-response");
    window.electron.on("storePassword-response", (response) => {
      if (response === "success") {
        const email = localStorage.getItem("currentUserEmail");
        window.electron.send("get-passwords", { email });
      } else {
        console.error("Failed to save password.");
      }
    });
  }

  if (accounts) {
    const email = localStorage.getItem("currentUserEmail");
    window.electron.send("get-passwords", { email });

    window.electron.removeAllListeners("get-passwords-response");
    window.electron.on("get-passwords-response", (passwords) => {
      accounts.innerHTML = "";
      passwords.forEach((entry) => renderPasswordEntry(accounts, entry));
    });
  }

  if (fileBtn && fileInput) {
    fileBtn.addEventListener("click", () => fileInput.click());
    fileInput.addEventListener("change", (event) => {
      const file = event.target.files[0];
      if (!file) return;

      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: function (results) {
          const email = localStorage.getItem("currentUserEmail");
          const entries = results.data.map((entry) => ({
            service: entry.service || entry.website || "Unknown",
            username: entry.username || entry.email || "Unknown",
            password: entry.password || entry.pass || "Unknown",
          }));

          entries.forEach((entry) => {
            window.electron.send("store-password", {
              email,
              serviceName: entry.service,
              serviceUsername: entry.username,
              servicePassword: entry.password,
            });
          });
        },
      });
    });
  }

  function renderPasswordEntry(container, entry) {
    let domain = entry.service.toLowerCase().replace(/\s+/g, "");
    if (!domain.includes(".")) domain += ".com";
    const logoURL = `https://logo.clearbit.com/${domain}`;
    const id = entry.password_id;

    const newAccount = document.createElement("div");
    newAccount.classList.add("password-box");
    newAccount.setAttribute("data-id", id);

    newAccount.innerHTML = `
      <div class="icon-row">
        <i class="fas fa-pencil-alt edit-icon" onclick="promptPin('edit', '${id}')"></i>
        <i class="fas fa-trash-alt delete-icon" onclick="confirmDelete('${id}')"></i>
      </div>
      <h4>${entry.service}</h4>
      <p>${entry.username}</p>
      <a href="#" class="external-link" data-href="https://${domain}">
        <img src="${logoURL}" class="site-logo" onerror="this.onerror=null;this.src='onErrorIcon.png';" />
      </a>
      <p class="password-field" data-real-password="${entry.password}" data-visible="false">••••••••</p>
      <div class="password-actions">
        <button class="toggle-password" onclick="togglePasswordVisibility(this.parentElement.previousElementSibling, this)">
          <i class="fas fa-eye"></i>
        </button>
        <button class="copy-password" onclick="copyPassword(this)">
          <i class="fas fa-copy"></i>
        </button>
      </div>
    `;
    container.appendChild(newAccount);
  }
});

// Restore/Delete Responses
window.electron.removeAllListeners("restoreORdelete-response");
window.electron.on("restoreORdelete-response", (response) => {
  const id = localStorage.getItem("currentPasswordId");
  const card = document.querySelector(`.password-box[data-id="${id}"]`);
  if (response === "success" && card) {
    card.remove();
    closeDeleteModal();
    closeRestoreModal();
    localStorage.removeItem("currentPasswordId");
  } else {
    console.error("Restore/Delete operation failed.");
  }
});

function closeDeleteModal() {
  document.getElementById("delete-confirmation")?.classList.add("hidden");
}

function closeRestoreModal() {
  document.getElementById("restore-confirmation")?.classList.add("hidden");
}

window.openEditWindow = function (id) {
  const card = document.querySelector(`.password-box[data-id="${id}"]`);
  if (!card) return;

  const siteName = card.querySelector("h4")?.innerText || "";
  const userEmail = card.querySelector("p")?.innerText || "";
  const password =
    card.querySelector(".password-field")?.dataset.realPassword || "";

  document.getElementById("siteName").value = siteName;
  document.getElementById("userEmail").value = userEmail;
  document.getElementById("generatedPassword").value = password;

  const passwordPopup = document.getElementById("passwordPopup");
  if (passwordPopup) {
    passwordPopup.style.display = "block";
    passwordPopup.scrollIntoView({ behavior: "smooth" });
  }
};
>>>>>>> Stashed changes
