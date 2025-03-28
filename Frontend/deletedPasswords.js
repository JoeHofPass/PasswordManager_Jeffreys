document.addEventListener("DOMContentLoaded", loadDeletedPasswords);

function loadDeletedPasswords() {
  const deletedList = document.getElementById("deletedList");
  deletedList.innerHTML = ""; // Clear previous entries

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

  const currentDate = new Date();
  deletedPasswords.forEach(({ site, email, password, deletedAt }) => {
    const deletionDate = new Date(deletedAt);
    const timeDiff = (currentDate - deletionDate) / (1000 * 60 * 60 * 24); // Days difference

    if (timeDiff <= 30) {
      createDeletedPasswordEntry(site, email, password);
    }
  });

  if (deletedList.innerHTML === "") {
    deletedList.innerHTML = `<p class="no-deleted-msg">No recently deleted passwords.</p>`;
  }
}

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

  deletedList.appendChild(accountCard);
}

function togglePassword(button) {
  const passwordInput = button.previousElementSibling;
  passwordInput.type = passwordInput.type === "password" ? "text" : "password";
}
