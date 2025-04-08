// dashboard.js

function openPasswordPopup() {
  clearInputFields();
  document.getElementById("passwordPopup").style.display = "block";
}

function closePasswordPopup() {
  document.getElementById("passwordPopup").style.display = "none";
}

function logout() {
  localStorage.removeItem("currentUserEmail");
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
}

function checkPasswordStrength(password) {
  const strengthBar = document.getElementById("strengthBar");
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
  document.getElementById("strengthText").innerText =
    strengthText[strength - 1];
}

function togglePasswordVisibility(passwordElement, toggleButton) {
  const isVisible = passwordElement.dataset.visible === "true";
  if (isVisible) {
    passwordElement.textContent = "••••••••••••";
    passwordElement.dataset.visible = "false";
    toggleButton.innerHTML = '<i class="fas fa-eye"></i>';
  } else {
    passwordElement.textContent = passwordElement.dataset.realPassword;
    passwordElement.dataset.visible = "true";
    toggleButton.innerHTML = '<i class="fas fa-eye-slash"></i>';
  }
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
  const id = Date.now(); // simple unique ID

  const accountList = document.getElementById("accountList");
  const newAccount = document.createElement("div");
  newAccount.classList.add("password-box");
  newAccount.style.position = "relative";

  newAccount.innerHTML = `
    <div class="icon-row">
      <i class="fas fa-pencil-alt edit-icon" title="Edit password" onclick="promptPin('edit', '${id}')"></i>
      <i class="fas fa-trash-alt delete-icon" title="Delete password" onclick="confirmDelete('${id}')"></i>
    </div>
    <h4>${siteName}</h4>
    <p>${userEmail}</p>
    <img src="${logoURL}" class="site-logo" onerror="this.onerror=null;this.src='default_logo.png';" />
    <p class="password-field" data-real-password="${password}" data-visible="false">••••••••••••</p>
    <button class="toggle-password" onclick="togglePasswordVisibility(this.previousElementSibling, this)">
      <i class="fas fa-eye"></i>
    </button>
  `;

  accountList.appendChild(newAccount);
  closePasswordPopup();
  clearInputFields();
}

function clearInputFields() {
  if (
    document.getElementById("siteName") &&
    document.getElementById("userEmail") &&
    document.getElementById("generatedPassword") &&
    document.getElementById("strengthBar") &&
    document.getElementById("strengthText")
  ) {
    document.getElementById("siteName").value = "";
    document.getElementById("userEmail").value = "";
    document.getElementById("generatedPassword").value = "";
    document.getElementById("strengthBar").value = 0;
    document.getElementById("strengthText").innerText = "";
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const searchBar = document.getElementById("searchBar");

  searchBar.addEventListener("input", function () {
    let filter = searchBar.value.toLowerCase();
    let cards = document.querySelectorAll(".password-box");

    cards.forEach((card) => {
      let siteName = card.querySelector("h4").innerText.toLowerCase();
      let userEmail = card.querySelector("p").innerText.toLowerCase();

      if (siteName.includes(filter) || userEmail.includes(filter)) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
  });
});

let inactivityTimer;
let currentAction = null;
let currentPasswordId = null;

function promptPin(action, passwordId) {
  currentAction = action;
  currentPasswordId = passwordId;
  document.getElementById("pin-modal").classList.remove("hidden");
}

function verifyPin() {
  const pin = document.getElementById("pin-input").value;
  const correctPin = "123456";

  if (pin === correctPin) {
    if (currentAction === "edit") {
      openEditWindow(currentPasswordId);
    } else if (currentAction === "unlock") {
      alert("Session unlocked.");
    }
    closePinModal();
  } else {
    alert("Invalid PIN. Must be 6 digits.");
  }
}

function closePinModal() {
  document.getElementById("pin-modal").classList.add("hidden");
  document.getElementById("pin-input").value = "";
}

function confirmDelete(passwordId) {
  currentPasswordId = passwordId;
  document.getElementById("delete-confirmation").classList.remove("hidden");
}

function deletePasswordConfirmed() {
  alert(`Password with ID ${currentPasswordId} moved to Deleted`);
  closeDeleteModal();
}

function closeDeleteModal() {
  document.getElementById("delete-confirmation").classList.add("hidden");
}

function openEditWindow(passwordId) {
  document.getElementById("passwordPopup").style.display = "block";
  document
    .getElementById("passwordPopup")
    .scrollIntoView({ behavior: "smooth" });
  document.getElementById("siteName").value = "apple";
  document.getElementById("userEmail").value = "john@gmail.com";
  document.getElementById("generatedPassword").value = "MyNewPassword123";
}

function resetInactivityTimer() {
  clearTimeout(inactivityTimer);
  inactivityTimer = setTimeout(() => {
    promptPin("unlock", null);
  }, 3 * 60 * 1000);
}

["click", "mousemove", "keypress"].forEach((evt) =>
  document.addEventListener(evt, resetInactivityTimer)
);

resetInactivityTimer();
