document.addEventListener("DOMContentLoaded", () => {
  const curr = localStorage.getItem("currentUserEmail");
  window.electron.send("get-deletedpasswords", {email : curr});

  window.electron.on("get-deletedpasswords-response", (deletedPasswords) => {
    //console.log("deleted password res:", deletedPasswords);
    const deletedList = document.getElementById("deletedList");
    deletedList.innerHTML = "";
    deletedPasswords.forEach(password => {
        let domain = password.service.toLowerCase().replace(/\s+/g, "");
        if (!domain.includes(".")) {
            domain += ".com";
        }
        const id = Date.now();

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
            <i class="fa-solid fa-trash-arrow-up restore-icon" title="Delete password" onclick="promptRecovery('${id}')"></i>
        </div>

    </div>
    `;
        deletedList.appendChild(accountCard);
    });
    if (deletedList.innerHTML === "") {
      deletedList.innerHTML = `<p class="no-deleted-msg">No recently deleted passwords.</p>`;
    }
  })
});
function promptRecovery(passwordId) {
  currentPasswordId = passwordId;
  document.getElementById("restore-confirmation").classList.remove("hidden");
}

function recoverPassword() {
  const card = document.querySelector(`.password-box[data-id="${currentPasswordId}"]`);
  if (card) {
    card.remove();
  }
  closeModal();
}

function closeModal() {
  document.getElementById("restore-confirmation").classList.add("hidden");
}

function togglePassword(button) {
  const passwordInput = button.previousElementSibling;
  passwordInput.type = passwordInput.type === "password" ? "text" : "password";
}
