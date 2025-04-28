document.addEventListener("DOMContentLoaded", () => {
  openPINModal();
  const pinForm = document.getElementById("pin-form");
  if (pinForm) {
    pinForm.addEventListener("submit", (e) => {
      e.preventDefault();
      submitPIN();
    });
  }
});

function openPINModal() {
  document.getElementById("pin-modal").style.display = "flex";
  document.getElementById("pin-status").classList.add("hidden");
}

function cancelPIN() {
  window.location.href = "home.html";
}

// function submitPIN() {
//   const pin = document.getElementById("pin-input").value.trim();
//   const currEmail = localStorage.getItem("currentUserEmail");

//   if (!pin) {
//     document.getElementById("pin-error").textContent = "Please enter a PIN.";
//     document.getElementById("pin-error").classList.remove("hidden");
//     return;
//   }

//   // ✅ Declare the handler FIRST
//   const handlePinResponse = (response) => {
//     if (response.status === "success") {
//       document.getElementById("pin-modal").style.display = "none";
//       fetchDeletedPasswords(currEmail);
//     } else {
//       document.getElementById("pin-error").textContent =
//         "Incorrect PIN. Access denied.";
//       document.getElementById("pin-error").classList.remove("hidden");
//     }
//   };

//   // ✅ Now safe to remove and attach listener
//   window.electron.removeAllListeners("verify-pin-response", handlePinResponse);
//   window.electron.on("verify-pin-response", handlePinResponse);

//   // ✅ Send IPC
//   window.electron.send("verify-pin", { email: currEmail, pin });
// }

function submitPIN() {
  const pin = document.getElementById("pin-input").value.trim();
  const currEmail = localStorage.getItem("currentUserEmail");
  const pinStatus = document.getElementById("pin-status");

  pinStatus.textContent = "";
  pinStatus.classList.add("hidden");

  if (!pin) {
    pinStatus.textContent = "❗ Please enter a PIN.";
    pinStatus.className = "pin-status error";
    pinStatus.classList.remove("hidden");
    return;
  }

  // Correctly declare handler BEFORE sending
  window.electron.removeAllListeners("verify-pin-response");
  window.electron.on("verify-pin-response", (response) => {
    pinStatus.classList.remove("hidden");

    if (response.status === "success") {
      pinStatus.textContent = "✅ Access granted!";
      pinStatus.className = "pin-status success";

      setTimeout(() => {
        document.getElementById("pin-modal").style.display = "none";
        pinStatus.classList.add("hidden");
        fetchDeletedPasswords(currEmail);
      }, 800);
    } else {
      pinStatus.textContent = "❌ Incorrect PIN. Try again.";
      pinStatus.className = "pin-status error";
    }
  });

  window.electron.send("verify-pin", { email: currEmail, pin });
}

function fetchDeletedPasswords(email) {
  window.electron.send("get-deletedpasswords", { email });

  window.electron.on("get-deletedpasswords-response", (deletedPasswords) => {
    const deletedList = document.getElementById("deletedList");
    deletedList.innerHTML = "";
    deletedPasswords.forEach((password) => {
      let domain = password.service.toLowerCase().replace(/\s+/g, "");
      if (!domain.includes(".")) {
        domain += ".com";
      }
      const id = password.password_id;
      const logoURL = `https://logo.clearbit.com/${domain}`;

      const accountCard = document.createElement("div");
      accountCard.setAttribute("data-id", id);
      accountCard.classList.add("password-box");
      accountCard.style.position = "relative";

      accountCard.innerHTML = `
        <img src="${logoURL}" onerror="this.onerror=null;this.src='onErrorIcon.png';" alt="${password.service}" class="site-logo" />
        <div class="account-info">
          <h4>${password.service}</h4>
          <p>${password.username}</p>
          <div class="password-container">
            <input type="password" class="password-field" readonly />
            <button class="toggle-password" onclick="togglePassword(this)">👁</button>
            <i class="fa-solid fa-trash-arrow-up restore-icon" title="Recover password" onclick="promptRecovery('${id}')"></i>
          </div>
        </div>`;
      const passwordField = accountCard.querySelector(".password-field");
      passwordField.value = password.password;
      deletedList.appendChild(accountCard);
    });

    if (deletedList.innerHTML === "") {
      deletedList.innerHTML = `<p class="no-deleted-msg">No recently deleted passwords.</p>`;
    }
  });
}

//let currentPasswordId = null;
function promptRecovery(passwordId) {
  localStorage.setItem("currentPasswordId", passwordId);
  document.getElementById("restore-confirmation").classList.remove("hidden");
}

function recoverPassword() {
  const id = localStorage.getItem("currentPasswordId");
  const card = document.querySelector(`.password-box[data-id="${id}"]`);
  if (card) {card.remove();}
  closeModal();
  localStorage.removeItem("currentPasswordId");
}

function closeModal() {
  document.getElementById("restore-confirmation").classList.add("hidden");
}

function togglePassword(button) {
  const passwordInput = button.previousElementSibling;
  passwordInput.type = passwordInput.type === "password" ? "text" : "password";
}
