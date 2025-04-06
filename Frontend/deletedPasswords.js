document.addEventListener("DOMContentLoaded", () => {

  const curr = localStorage.getItem("currentUserEmail");
  window.electron.send("get-deletedpasswords", {email : curr});

  window.electron.on("get-deletedpasswords-response", (deletedPasswords) => {
    console.log("deleted password res:", deletedPasswords);
    const deletedList = document.getElementById("deletedList");
    deletedList.innerHTML = ""; // Clear previous entries
    deletedPasswords.forEach(password => {
        let domain = password.service.toLowerCase().replace(/\s+/g, "");
        if (!domain.includes(".")) {
            domain += ".com";
        }

        const logoURL = `https://logo.clearbit.com/${domain}`;
        const accountCard = document.createElement("div");
        accountCard.classList.add("account-card");

        accountCard.innerHTML = `
    <img src="${logoURL}" onerror="this.onerror=null;this.src='default_logo.png';" alt="${password.service}" class="site-logo" />
    <div class="account-info">
        <strong>${password.service}</strong>
        <p>${password.username}</p>
        <div class="password-container">
            <input type="password" value="${password.password}" class="password-field" readonly />
            <button class="toggle-password" onclick="togglePassword(this)">👁</button>
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

function togglePassword(button) {
  const passwordInput = button.previousElementSibling;
  passwordInput.type = passwordInput.type === "password" ? "text" : "password";
}
