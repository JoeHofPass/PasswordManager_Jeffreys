<<<<<<< Updated upstream
document.addEventListener("DOMContentLoaded", loadDeletedPasswords);

function loadDeletedPasswords() {
  const deletedList = document.getElementById("deletedList");
  deletedList.innerHTML = ""; // Clear previous entries
=======
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
>>>>>>> Stashed changes

  const deletedPasswords = [
    {
      site: "Amazon",
      email: "user@example.com",
      password: "OldPass123!",
      deletedAt: "2024-03-01",
    },
    {
      site: "Netflix",
      email: "john.doe@netflix.com",
      password: "MyNetflix123!",
      deletedAt: "2024-02-15",
    },
    {
      site: "Facebook",
      email: "jane.doe@facebook.com",
      password: "FacebookPass!",
      deletedAt: "2024-02-28",
    },
  ]; // Simulated deleted passwords (Replace with actual storage)

<<<<<<< Updated upstream
  const currentDate = new Date();
  deletedPasswords.forEach(({ site, email, password, deletedAt }) => {
    const deletionDate = new Date(deletedAt);
    const timeDiff = (currentDate - deletionDate) / (1000 * 60 * 60 * 24); // Days difference

    if (timeDiff <= 30) {
      createDeletedPasswordEntry(site, email, password);
    }
=======
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

  window.electron.removeAllListeners("get-deletedpasswords-response");
  window.electron.on("get-deletedpasswords-response", (deletedPasswords) => {
    const deletedList = document.getElementById("deletedList");
    deletedList.innerHTML = "";

    if (!deletedPasswords.length) {
      deletedList.innerHTML = `<p class="no-deleted-msg">No recently deleted passwords.</p>`;
      return;
    }

    deletedPasswords.forEach((password) => {
      let domain = password.service.toLowerCase().replace(/\s+/g, "");
      if (!domain.includes(".")) domain += ".com";
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
            <input type="password" value="${password.password}" class="password-field" readonly />
            <button class="toggle-password" onclick="togglePassword(this)">👁</button>
            <i class="fa-solid fa-trash-arrow-up restore-icon" title="Recover password" onclick="promptRecovery('${id}')"></i>
          </div>
        </div>`;

      deletedList.appendChild(accountCard);
    });
>>>>>>> Stashed changes
  });

  if (deletedList.innerHTML === "") {
    deletedList.innerHTML = `<p class="no-deleted-msg">No recently deleted passwords.</p>`;
  }
}

<<<<<<< Updated upstream
function createDeletedPasswordEntry(site, email, password) {
  const deletedList = document.getElementById("deletedList");
  const accountCard = document.createElement("div");
  accountCard.classList.add("account-card");

  accountCard.innerHTML = `
    <img src="default_logo.png" alt="${site}" class="site-logo" />
    <div class="account-info">
      <strong>${site}</strong>
      <p>${email}</p>
      <div class="password-container">
        <input type="password" value="${password}" class="password-field" readonly />
        <button class="toggle-password" onclick="togglePassword(this)">👁</button>
      </div>
    </div>
  `;
=======
function promptRecovery(passwordId) {
  localStorage.setItem("currentPasswordId", passwordId);
  document.getElementById("restore-confirmation").classList.remove("hidden");
}

function recoverPassword() {
  const id = localStorage.getItem("currentPasswordId");
  const card = document.querySelector(`.password-box[data-id="${id}"]`);
  if (card) card.remove();
  closeModal();
  localStorage.removeItem("currentPasswordId");
}
>>>>>>> Stashed changes

  deletedList.appendChild(accountCard);
}

function togglePassword(button) {
  const passwordInput = button.previousElementSibling;
  passwordInput.type = passwordInput.type === "password" ? "text" : "password";
}
