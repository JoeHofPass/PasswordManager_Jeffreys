function openPasswordPopup() {
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
  //checkPasswordStrength(password);
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
}

document.addEventListener("DOMContentLoaded", function () {
  const searchBar = document.getElementById("searchBar");

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
