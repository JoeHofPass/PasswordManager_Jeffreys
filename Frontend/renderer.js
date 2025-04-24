document.addEventListener("DOMContentLoaded", () => {
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
      const zeroORone = "1"; // 1 = restore

      if (!email || !password_id || !window.electron) return;

      window.electron.send("restoreORdelete", {
        email,
        password_id,
        zeroORone,
      });
    });
  }

  window.deletePasswordConfirmed = function () {
    const id = localStorage.getItem("currentPasswordId");
    const card = document.querySelector(`.password-box[data-id="${id}"]`);
    if (card) card.remove();
    closeDeleteModal();
    localStorage.removeItem("currentPasswordId");
  };

  // ✅ External link support
  document.body.addEventListener("click", (e) => {
    const anchor = e.target.closest("a.external-link");
    if (anchor) {
      e.preventDefault();
      const targetUrl = anchor.getAttribute("data-href");

      if (
        window.electron &&
        typeof window.electron.openExternal === "function"
      ) {
        try {
          window.electron.openExternal(targetUrl);
        } catch (err) {
          console.error("openExternal failed:", err);
          window.open(targetUrl, "_blank");
        }
      } else {
        console.warn(
          "Electron external shell not available. Opening in new tab."
        );
        window.open(targetUrl, "_blank");
      }
    }
  });

  // ✅ Login
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

  // ✅ PIN verification
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
              openEditWindow(localStorage.getItem("currentPasswordId"));
              break;
            case "delete":
              deletePasswordConfirmed();
              break;
            case "unlock":
              document.body.classList.remove("locked");
              break;
          }

          window.currentAction = null;
        }, 1000);
      } else {
        pinStatus.className = "pin-status error";
        pinStatus.textContent = "❌ Incorrect PIN. Try again or logout.";
      }
    });
  }

  // ✅ Registration
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

  // ✅ Save password
  if (passwordPopup) {
    document
      .getElementById("savepassbtn")
      ?.addEventListener("click", (event) => {
        event.preventDefault();
        const email = localStorage.getItem("currentUserEmail");
        const serviceName = document.getElementById("siteName").value;
        const serviceUsername = document.getElementById("userEmail").value;
        const servicePassword =
          document.getElementById("generatedPassword").value;
        const password_id = localStorage.getItem("currentPasswordId");

        window.electron.send("store-password", {
          email,
          serviceName,
          serviceUsername,
          servicePassword,
          password_id,
        });
      });

    window.electron.removeAllListeners("storePassword-response");
    window.electron.on("storePassword-response", (response) => {
      if (response === "success") {
        closePasswordPopup();
      } else {
        console.error("Failed to save password.");
      }
    });
  }
  if (fileBtn && fileInput) {
    fileBtn.addEventListener("click", () => {
      fileInput.click();
    });

    fileInput.addEventListener("change", (event) => {
      const file = event.target.files[0];
      if (!file) return;

      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: function (results) {
          const email = localStorage.getItem("currentUserEmail");
          const entries = results.data.map((entry) => ({
            service: entry.service || entry.website || entry.url || "Unknown",
            username: entry.username || entry.email || "Unknown",
            password: entry.password || entry.pass,
          }));

          let importSuccess = 0;
          let importFail = 0;

          entries.forEach((entry) => {
            window.electron.send("store-password", {
              email,
              serviceName: entry.service,
              serviceUsername: entry.username,
              servicePassword: entry.password,
            });

            window.electron.once("storePassword-response", (response) => {
              if (response === "success") {
                importSuccess++;
              } else {
                importFail++;
              }

              if (importSuccess + importFail === entries.length) {
                alert(
                  `${importSuccess} passwords imported, ${importFail} failed.`
                );
              }
            });
          });
        },
      });
    });
  }

  // ✅ Render passwords
  if (accounts) {
    const email = localStorage.getItem("currentUserEmail");
    window.electron.send("get-passwords", { email });

    window.electron.removeAllListeners("get-passwords-response");
    window.electron.on("get-passwords-response", (passwords) => {
      accounts.innerHTML = "";
      passwords.forEach((entry) => renderPasswordEntry(accounts, entry));
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
    newAccount.style.position = "relative";

    newAccount.innerHTML = `
    <div class="icon-row">
      <i class="fas fa-pencil-alt edit-icon" title="Edit password" onclick="promptPin('edit', '${id}')"></i>
      <i class="fas fa-trash-alt delete-icon" title="Delete password" onclick="confirmDelete('${id}')"></i>
    </div>
    <h4>${entry.service}</h4>
    <p>${entry.username}</p>
    <a href="#" class="external-link" data-href="https://${domain}">
      <img src="${logoURL}" class="site-logo" onerror="this.onerror=null;this.src='onErrorIcon.png';" />
    </a>
    <p class="password-field" data-real-password="${entry.password}" data-visible="false">••••••••••••</p>
    <div class="password-actions">
      <button class="toggle-password" onclick="togglePasswordVisibility(this.parentElement.previousElementSibling, this)">
        <i class="fas fa-eye"></i>
      </button>
      <button class="copy-password" onclick="copyPassword(this)" title="Copy password">
        <i class="fas fa-copy"></i>
      </button>
    </div>
  `;

    container.appendChild(newAccount);
  }
});
// Make recoverPassword and closeModal globally accessible
window.electron.removeAllListeners("restoreORdelete-response");
window.electron.on("restoreORdelete-response", (response) => {
  const id = localStorage.getItem("currentPasswordId");
  const card = document.querySelector(`.password-box[data-id="${id}"]`);

  if (response === "success") {
    if (card) card.remove();
    closeDeleteModal(); // for delete case
    closeRestoreModal(); // for restore case
    localStorage.removeItem("currentPasswordId");
  } else {
    console.error("❌ Restore/Delete operation failed.");
  }
});

window.closeModal = function () {
  const modal = document.getElementById("restore-confirmation");
  if (modal) modal.classList.add("hidden");
};

function closeDeleteModal() {
  document.getElementById("delete-confirmation")?.classList.add("hidden");
}

function closeRestoreModal() {
  document.getElementById("restore-confirmation")?.classList.add("hidden");
}
