function openPasswordPopup() {
  clearInputFields();
  document.getElementById("passwordPopup").style.display = "block";
}

function closePasswordPopup() {
  document.getElementById("passwordPopup").style.display = "none";
}

function generatePassword() {
  const length = 16;
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  document.getElementById("generatedPassword").value = password;
  checkPasswordStrength(password);
}

function checkPasswordStrength(password) {
  const strengthBar = document.getElementById("strengthBar");
  if (!strengthBar) return;
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

  document.getElementById("strengthText").innerText = strengthText[strength - 1] || "Too Short";
}

function togglePasswordVisibility(passwordElement, toggleButton) {
  if (!passwordElement) return;
  const isVisible = passwordElement.dataset.visible === "true";
  passwordElement.textContent = isVisible
    ? "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
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
  if (!domain.includes(".")) {
    domain += ".com";
  }
  const logoURL = `https://logo.clearbit.com/${domain}`;
  // const id = crypto.randomUUID();
  // localStorage.setItem("currentPasswordId", id);
  let id = localStorage.getItem("currentPasswordId");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("currentPasswordId", id);
  }
  const accountList = document.getElementById("accountList");
  let existingPassword = document.querySelector(`.password-box[data-id="${id}"]`);
  if (existingPassword) {
    existingPassword.querySelector("h4").innerText = siteName;
    existingPassword.querySelector("p").innerText = userEmail;
    existingPassword.querySelector(".site-logo").src = logoURL;
    existingPassword.querySelector(".password-field").dataset.realPassword = password;
    existingPassword.querySelector(".password-field").textContent = "••••••••••••";
    existingPassword.querySelector(".password-field").dataset.visible = "false";
  } else {
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
    <img src="${logoURL}" class="site-logo" onerror="this.onerror=null;this.src='onErrorIcon.png';" />
    <p class="password-field" data-real-password="" data-visible="false">••••••••••••</p>
    <div class="password-actions">
      <button class="toggle-password" onclick="togglePasswordVisibility(this.parentElement.previousElementSibling, this)">
        <i class="fas fa-eye"></i>
      </button>
      <button class="copy-password" onclick="copyPassword(this)" title="Copy password">
        <i class="fas fa-copy"></i>
      </button>
    </div>
    `;
    const passwordField = newAccount.querySelector(".password-field");
    passwordField.dataset.realPassword = password;
    accountList.appendChild(newAccount);
  }
  closePasswordPopup();
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
  console.log("Clearing input fields");
  if (
    document.getElementById("siteName") &&
    document.getElementById("userEmail") &&
    document.getElementById("generatedPassword")
    //document.getElementById("strengthBar") &&
    //document.getElementById("strengthText")
  ) {
    document.getElementById("siteName").value = "";
    document.getElementById("userEmail").value = "";
    document.getElementById("generatedPassword").value = "";
    //document.getElementById("strengthBar").value = 0;
    //document.getElementById("strengthText").innerText = "";
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const searchBar = document.getElementById("searchBar");
  if (searchBar) {
    searchBar.addEventListener("input", () => {
      const filter = searchBar.value.toLowerCase();
      document.querySelectorAll(".password-box").forEach((card) => {
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
  passwordInput?.addEventListener("input", (e) =>
    checkPasswordStrength(e.target.value)
  );
});

let inactivityTimer;
let currentAction = null;

// function promptPin(action, id) {
//   currentAction = action;
//   currentPasswordId(id);
//   const cancelButton = document.getElementById("cancel-pin-btn");

//   if (action === "unlock") {
//     cancelButton.textContent = "Logout";
//     cancelButton.onclick = logout;
//   } else {
//     cancelButton.textContent = "Cancel";
//     cancelButton.onclick = closePinModal;
//   }
//   document.getElementById("pin-modal").classList.remove("hidden");
// }

function promptPin(action, id) {
  window.currentAction = action;
  if (id) {
    localStorage.setItem("currentPasswordId", id);
  }

  const cancelButton = document.getElementById("cancel-pin-btn");
  const pinStatus = document.getElementById("pin-status");
  pinStatus?.classList.add("hidden");
  pinStatus.textContent = "";

  cancelButton.textContent = action === "unlock" ? "Logout" : "Cancel";
  cancelButton.onclick = action === "unlock" ? logout : closePinModal;

  document.getElementById("pin-modal").classList.remove("hidden");
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
  if (card) { card.remove(); }
  closeDeleteModal();
  localStorage.removeItem("currentPasswordId");
}

function closeDeleteModal() {
  document.getElementById("delete-confirmation").classList.add("hidden");
}

function openEditWindow(id) {
  // document.getElementById("passwordPopup").style.display = "block";
  // document.getElementById("passwordPopup").scrollIntoView({ behavior: "smooth" });
  // document.getElementById("siteName").value = siteName;
  // document.getElementById("userEmail").value = userEmail;
  // document.getElementById("generatedPassword").value = "";
  const card = document.querySelector(`.password-box[data-id="${id}"]`);
  if (!card) return;

  const siteName = card.querySelector("h4")?.innerText || "";
  const userEmail = card.querySelector("p")?.innerText || "";
  const password = card.querySelector(".password-field")?.dataset.realPassword || "";

  document.getElementById("siteName").value = siteName;
  document.getElementById("userEmail").value = userEmail;
  document.getElementById("generatedPassword").value = password;

  const passwordPopup = document.getElementById("passwordPopup");
  if (passwordPopup) {
    passwordPopup.style.display = "block";
    passwordPopup.scrollIntoView({ behavior: "smooth" });
  }
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

// Called when user clicks the Deleted tab
// function requestPinToAccessDeleted() {
//   currentAction = "access-deleted";
//   document.body.classList.add("locked");
//   document.getElementById("pin-modal").classList.remove("hidden");
// }
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

// Cancel button behavior: block if it's during a security lock
function cancelPin() {
  if (currentAction === "unlock") {
    alert("You must verify your PIN to continue using GateKeep.");
    return;
  }
  closePinModal();
}