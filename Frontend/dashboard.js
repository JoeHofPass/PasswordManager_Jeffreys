function openPasswordPopup() {
  clearInputFields();
  document.getElementById("passwordPopup").style.display = "block";
}

function closePasswordPopup() {
  document.getElementById("passwordPopup").style.display = "none";
}

function logout() {
  localStorage.removeItem("currentUserEmail");
  window.location.href = "login.html";
}

function generatePassword() {
  const length = 16;
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  const generated = document.getElementById("generatedPassword");
  generated.value = password;
  checkPasswordStrength(password);
}

function checkPasswordStrength(password) {
  const strengthBar = document.getElementById("strengthBar");
  const strengthLabel = document.getElementById("strengthText");
  if (!strengthBar || !strengthLabel) return;

  let strength = 0;
  if (password.length >= 8) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;

  strengthBar.value = strength;
  const strengthText = [
    "Very Weak",
    "Weak",
    "Moderate",
    "Strong",
    "Very Strong",
  ];
  strengthLabel.innerText = strengthText[strength - 1] || "Too Short";
}

function togglePasswordVisibility(passwordElement, toggleButton) {
  if (!passwordElement) return;
  const isVisible = passwordElement.dataset.visible === "true";
  passwordElement.textContent = isVisible
    ? "••••••••••••"
    : passwordElement.dataset.realPassword;
  passwordElement.dataset.visible = !isVisible;
  toggleButton.innerHTML = isVisible
    ? '<i class="fas fa-eye"></i>'
    : '<i class="fas fa-eye-slash"></i>';
}

function saveNewPassword() {
  const siteName = document.getElementById("siteName").value;
  const userEmail = document.getElementById("userEmail").value;
  const password = document.getElementById("generatedPassword").value;

  if (!siteName || !userEmail || !password) {
    alert("All fields are required!");
    return;
  }

  let domain = siteName.toLowerCase().replace(/\s+/g, "");
  if (!domain.includes(".")) domain += ".com";

  const href = `https://${domain}`;
  const logoURL = `https://logo.clearbit.com/${domain}`;
  const id = crypto.randomUUID();
  localStorage.setItem("currentPasswordId", id);

  const newAccount = document.createElement("div");
  newAccount.setAttribute("data-id", id);
  newAccount.classList.add("password-box");
  newAccount.style.position = "relative";

  newAccount.innerHTML = `
    <div class="icon-row">
      <i class="fas fa-pencil-alt edit-icon" title="Edit password" onclick="promptPin('edit', '${id}')"></i>
      <i class="fas fa-trash-alt delete-icon" title="Delete password" onclick="confirmDelete('${id}')"></i>
    </div>
    <h4>${siteName}</h4>
    <p>${userEmail}</p>
    <a href="#" class="external-link" data-href="${href}">
      <img src="${logoURL}" class="site-logo" onerror="this.onerror=null;this.src='onErrorIcon.png';" />
    </a>
    <p class="password-field" data-real-password="${password}" data-visible="false">••••••••••••</p>
    <div class="password-actions">
      <button class="toggle-password" onclick="togglePasswordVisibility(this.parentElement.previousElementSibling, this)">
        <i class="fas fa-eye"></i>
      </button>
      <button class="copy-password" onclick="copyPassword(this)" title="Copy password">
        <i class="fas fa-copy"></i>
      </button>
    </div>
  `;

  document.getElementById("accountList").appendChild(newAccount);
  closePasswordPopup();

  if (window.electron) {
    const email = localStorage.getItem("currentUserEmail");
    window.electron.send("store-password", {
      email,
      serviceName: siteName,
      serviceUsername: userEmail,
      servicePassword: password,
      password_id: id,
    });
  }
}

function copyPassword(button) {
  const passwordElement = button
    .closest(".password-box")
    ?.querySelector(".password-field");
  if (!passwordElement) return;

  const password = passwordElement.dataset.realPassword;
  navigator.clipboard.writeText(password).then(() => {
    button.innerHTML = '<i class="fas fa-check"></i>';
    setTimeout(() => (button.innerHTML = '<i class="fas fa-copy"></i>'), 1500);
  });
}

function clearInputFields() {
  document.getElementById("siteName").value = "";
  document.getElementById("userEmail").value = "";
  document.getElementById("generatedPassword").value = "";
  const bar = document.getElementById("strengthBar");
  const label = document.getElementById("strengthText");
  if (bar) bar.value = 0;
  if (label) label.innerText = "";
}

document.addEventListener("DOMContentLoaded", function () {
  const searchBar = document.getElementById("searchBar");
  if (searchBar) {
    searchBar.addEventListener("input", function () {
      const filter = searchBar.value.toLowerCase();
      const cards = document.querySelectorAll(".password-box");
      cards.forEach((card) => {
        const siteName = card.querySelector("h4").innerText.toLowerCase();
        const userEmail = card.querySelector("p").innerText.toLowerCase();
        card.style.display =
          siteName.includes(filter) || userEmail.includes(filter)
            ? "block"
            : "none";
      });
    });
  }

  const passwordInput = document.getElementById("generatedPassword");
  if (passwordInput) {
    passwordInput.addEventListener("input", (e) =>
      checkPasswordStrength(e.target.value)
    );
  }
  const deleteBtn = document.getElementById("deletepassbtn");
  if (deleteBtn) {
    deleteBtn.addEventListener("click", (event) => {
      event.preventDefault();
      const email = localStorage.getItem("currentUserEmail");
      const password_id = localStorage.getItem("currentPasswordId");
      const zeroORone = "0";
      if (!window.electron) return;
      window.electron.send("restoreORdelete", {
        email,
        password_id,
        zeroORone,
      });
    });
  }

  const restoreBtn = document.getElementById("confirmBtn");
  if (restoreBtn) {
    restoreBtn.addEventListener("click", (event) => {
      event.preventDefault();
      const email = localStorage.getItem("currentUserEmail");
      const password_id = localStorage.getItem("currentPasswordId");
      const zeroORone = "1";
      if (!window.electron) return;
      window.electron.send("restoreORdelete", {
        email,
        password_id,
        zeroORone,
      });
    });
  }

  // Bind result listener only once
  window.electron.removeAllListeners("restoreORdelete-response");
  window.electron.on("restoreORdelete-response", (response) => {
    if (response === "success") {
      const id = localStorage.getItem("currentPasswordId");
      const card = document.querySelector(`.password-box[data-id="${id}"]`);
      if (card) card.remove();
      closeDeleteModal();
      closeModal(); // for recovery
      localStorage.removeItem("currentPasswordId");
    } else {
      console.error("Delete/Restore operation failed.");
    }
  });
});

let inactivityTimer;
let currentAction = null;

function promptPin(action, id) {
  currentAction = action;
  if (id) currentPasswordId(id);

  const cancelButton = document.getElementById("cancel-pin-btn");
  const pinStatus = document.getElementById("pin-status");
  pinStatus?.classList.add("hidden");
  pinStatus.textContent = "";

  cancelButton.textContent = action === "unlock" ? "Logout" : "Cancel";
  cancelButton.onclick = action === "unlock" ? logout : closePinModal;

  document.getElementById("pin-modal").classList.remove("hidden");
}

function submitPIN() {
  const pin = document.getElementById("pin-input").value.trim();
  const currEmail = localStorage.getItem("currentUserEmail");
  const pinStatus = document.getElementById("pin-status");

  pinStatus.classList.add("hidden");
  pinStatus.textContent = "";

  if (!pin) {
    pinStatus.className = "pin-status error";
    pinStatus.textContent = "❗ Please enter a PIN.";
    pinStatus.classList.remove("hidden");
    return;
  }

  const handlePinResponse = (response) => {
    pinStatus.classList.remove("hidden");

    if (response.status === "success") {
      pinStatus.className = "pin-status success";
      pinStatus.textContent = "✅ Access granted!";
      setTimeout(() => {
        document.getElementById("pin-modal").classList.add("hidden");
        pinStatus.classList.add("hidden");
        pinStatus.textContent = "";

        switch (currentAction) {
          case "edit":
            openEditWindow(localStorage.getItem("currentPasswordId"));
            break;
          case "delete":
            deletePasswordConfirmed();
            break;
          case "access-deleted":
            window.location.href = "deletedPasswords.html";
            break;
          case "unlock":
            document.body.classList.remove("locked");
            break;
        }

        currentAction = null;
      }, 1200);
    } else {
      pinStatus.className = "pin-status error";
      pinStatus.textContent = "❌ Incorrect PIN. Try again or logout.";
    }
  };

  if (!window.electron) return;
  window.electron.removeAllListeners("verify-pin-response");
  window.electron.on("verify-pin-response", handlePinResponse);
  window.electron.send("verify-pin", { email: currEmail, pin });
}

function closePinModal() {
  document.getElementById("pin-modal").classList.add("hidden");
  document.getElementById("pin-input").value = "";
  const cancelButton = document.getElementById("cancel-pin-btn");
  cancelButton.textContent = "Cancel";
  cancelButton.onclick = closePinModal;
  currentAction = null;
}

function currentPasswordId(id) {
  localStorage.setItem("currentPasswordId", id);
}

function confirmDelete(id) {
  currentPasswordId(id);
  document.getElementById("delete-confirmation").classList.remove("hidden");
}

function deletePasswordConfirmed() {
  const id = localStorage.getItem("currentPasswordId");
  const card = document.querySelector(`.password-box[data-id="${id}"]`);
  if (card) card.remove();
  closeDeleteModal();
  localStorage.removeItem("currentPasswordId");
}

function closeDeleteModal() {
  document.getElementById("delete-confirmation").classList.add("hidden");
}

function openEditWindow(id) {
  const card = document.querySelector(`.password-box[data-id="${id}"]`);
  if (!card) return;
  const siteName = card.querySelector("h4")?.innerText || "";
  const userEmail = card.querySelector("p")?.innerText || "";
  const password =
    card.querySelector(".password-field")?.dataset.realPassword || "";

  document.getElementById("siteName").value = siteName;
  document.getElementById("userEmail").value = userEmail;
  document.getElementById("generatedPassword").value = password;
  checkPasswordStrength(password);
  document.getElementById("passwordPopup").style.display = "block";
  document
    .getElementById("passwordPopup")
    .scrollIntoView({ behavior: "smooth" });
}

function resetInactivityTimer() {
  clearTimeout(inactivityTimer);
  inactivityTimer = setTimeout(() => {
    promptPin("unlock", null);
  }, 60000);
}

["click", "mousemove", "keypress"].forEach((evt) =>
  document.addEventListener(evt, resetInactivityTimer)
);

resetInactivityTimer();

function requestPinToAccessDeleted() {
  currentAction = "access-deleted";
  document.body.classList.add("locked");
  const cancelButton = document.getElementById("cancel-pin-btn");
  cancelButton.textContent = "Cancel";
  cancelButton.onclick = closePinModal;

  const pinStatus = document.getElementById("pin-status");
  pinStatus.classList.add("hidden");
  pinStatus.textContent = "";

  document.getElementById("pin-modal").classList.remove("hidden");
}

function cancelPin() {
  if (currentAction === "unlock") {
    alert("You must verify your PIN to continue using GateKeep.");
    return;
  }
  closePinModal();
}
