// FINAL CLEANED dashboard.js

function openPasswordPopup() {
  document.getElementById("passwordPopup").style.display = "block";
}

function closePasswordPopup() {
  document.getElementById("passwordPopup").style.display = "none";
}

function logout() {
  localStorage.removeItem("currentUserEmail");
<<<<<<< Updated upstream
=======
  window.location.href = "login.html";
>>>>>>> Stashed changes
}

function generatePassword() {
  const length = 16;
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
<<<<<<< Updated upstream
  document.getElementById("generatedPassword").value = password;
  //checkPasswordStrength(password);
=======
  const generated = document.getElementById("generatedPassword");
  generated.value = password;
  checkPasswordStrength(password);
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
function togglePassword(button) {
  const passwordField = button.previousElementSibling;
  if (passwordField.type === "password") {
    passwordField.type = "text";
    button.innerText = "🙈";
  } else {
    passwordField.type = "password";
    button.innerText = "👁";
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


  const accountList = document.getElementById("accountList");
  const newAccount = document.createElement("div");
  newAccount.classList.add("account-card");
  newAccount.innerHTML = `
        <img src="${logoURL}" onerror="this.onerror=null;this.src='default_logo.png';" alt="${siteName}" class="site-logo" />
        <div class="account-info">
            <strong>${siteName}</strong>
            <p>${userEmail}</p>
            <div class="password-container">
                <input type="password" value="${password}" class="password-field" readonly />
                <button class="toggle-password" onclick="togglePassword(this)">👁</button>
            </div>
        </div>
    `;

  accountList.appendChild(newAccount);
  closePasswordPopup();
  clearInputFields();
}

function clearInputFields() {
  if (
  document.getElementById("siteName")&& 
  document.getElementById("userEmail")&&
  document.getElementById("generatedPassword")&&
  document.getElementById("strengthBar")&&
  document.getElementById("strengthText")
  ) {
  document.getElementById("siteName").value = "";
  document.getElementById("userEmail").value = "";
  document.getElementById("generatedPassword").value = "";
  document.getElementById("strengthBar").value = 0;
  document.getElementById("strengthText").innerText = "";
  }
=======
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
>>>>>>> Stashed changes
}

document.addEventListener("DOMContentLoaded", () => {
  const searchBar = document.getElementById("searchBar");
<<<<<<< Updated upstream

  searchBar.addEventListener("input", function () {
    let filter = searchBar.value.toLowerCase();
    let cards = document.querySelectorAll(".account-card");

    cards.forEach((card) => {
      let siteName = card.querySelector("strong").innerText.toLowerCase();
      let userEmail = card.querySelector("p").innerText.toLowerCase();

      // Show only cards that match the search term
      if (siteName.includes(filter) || userEmail.includes(filter)) {
        card.style.display = "flex"; // Show matching results
      } else {
        card.style.display = "none"; // Hide non-matching results
      }
    });
  });

  if (
    document.getElementById("generatePasswordBtn")&&
    document.getElementById("savePasswordBtn")&&
    document.getElementById("openPopupBtn")&&
    document.getElementById("closePopupBtn")
    ) {
      document.getElementById("generatePasswordBtn").addEventListener("click", generatePassword);
      document.getElementById("savePasswordBtn").addEventListener("click", saveNewPassword);
      document.getElementById("openPopupBtn").addEventListener("click", openPasswordPopup);
      document.getElementById("closePopupBtn").addEventListener("click", closePasswordPopup);

    }
});
=======
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

function resetInactivityTimer() {
  clearTimeout(inactivityTimer);
  inactivityTimer = setTimeout(() => promptPin("unlock", null), 60000);
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
>>>>>>> Stashed changes
