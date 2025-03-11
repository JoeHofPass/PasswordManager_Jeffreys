function openPasswordPopup() {
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
}

function saveNewPassword() {
  const siteName = document.getElementById("siteName").value;
  const userEmail = document.getElementById("userEmail").value;
  const password = document.getElementById("generatedPassword").value;

  if (!siteName || !userEmail || !password) {
    alert("All fields are required!");
    return;
  }

  const accountList = document.getElementById("accountList");
  const newAccount = document.createElement("div");
  newAccount.classList.add("account-card");
  newAccount.innerHTML = `
        <img src="default_logo.png" alt="logo" class="site-logo" />
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
}
