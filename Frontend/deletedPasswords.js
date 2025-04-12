// deletedPasswords.js — DEMO fallback with functional buttons

document.addEventListener("DOMContentLoaded", () => {
  const deletedPasswords = [
    {
      service: "Apple",
      username: "john@example.com",
      password: "ApplePassword123",
      deletedAt: "2023-09-10T10:00:00Z",
    },
    {
      service: "Amazon",
      username: "jane@amazon.com",
      password: "AmazonPassword123",
      deletedAt: "2023-09-01T10:00:00Z",
    },
    {
      service: "Netflix",
      username: "bill@netflix.com",
      password: "NetflixPassword123",
      deletedAt: "2023-09-05T10:00:00Z",
    },
  ];

  const deletedList = document.getElementById("deletedList");
  deletedList.innerHTML = "";

  if (deletedPasswords.length === 0) {
    deletedList.innerHTML = `<p class="no-deleted-msg">No recently deleted passwords.</p>`;
  }

  deletedPasswords.forEach((password, i) => {
    const daysLeft = getDaysLeftToDelete(password.deletedAt);
    const card = createPasswordCard(password, daysLeft, i);
    deletedList.appendChild(card);
  });

  document.getElementById("searchBar").addEventListener("input", function () {
    const filter = this.value.toLowerCase();
    document.querySelectorAll(".password-box").forEach((card) => {
      const service = card.querySelector("h4").innerText.toLowerCase();
      const email = card.querySelector("p").innerText.toLowerCase();
      card.style.display =
        service.includes(filter) || email.includes(filter) ? "block" : "none";
    });
  });
});

function getDaysLeftToDelete(deletedAt) {
  const currentDate = new Date();
  const deletedDate = new Date(deletedAt);
  const diffTime = currentDate - deletedDate;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, 30 - diffDays);
}

function createPasswordCard(password, daysLeft, index) {
  let domain = password.service.toLowerCase().replace(/\s+/g, "");
  if (!domain.includes(".")) domain += ".com";
  const logoURL = `https://logo.clearbit.com/${domain}`;

  const card = document.createElement("div");
  card.classList.add("password-box");
  card.innerHTML = `
    <img src="${logoURL}" onerror="this.onerror=null;this.src='default_logo.png';" class="site-logo" />
    <div class="account-info">
      <h4>${password.service}</h4>
      <p>${password.username}</p>
      <p class="days-left">Days left to recover: <strong>${daysLeft}</strong></p>
    </div>
    <div class="action-buttons">
      <button class="recover-btn" id="recover-${index}">Recover</button>
      <button class="delete-btn" id="delete-${index}">Delete Forever</button>
    </div>
  `;

  setTimeout(() => {
    document
      .getElementById(`recover-${index}`)
      .addEventListener("click", () => promptRecovery(password.service));
    document
      .getElementById(`delete-${index}`)
      .addEventListener("click", () => promptDeletion(password.service));
  }, 0);

  return card;
}

function promptRecovery(service) {
  document.getElementById(
    "confirmText"
  ).innerText = `Do you want to recover the password for ${service}?`;
  document.getElementById("confirmationModal").classList.remove("hidden");
  document.getElementById("confirmBtn").onclick = () =>
    recoverPassword(service);
  document.getElementById("cancelBtn").onclick = closeModal;
}

function promptDeletion(service) {
  document.getElementById(
    "confirmText"
  ).innerText = `Are you sure you want to permanently delete ${service}?`;
  document.getElementById("confirmationModal").classList.remove("hidden");
  document.getElementById("confirmBtn").onclick = () => deletePassword(service);
  document.getElementById("cancelBtn").onclick = closeModal;
}

function recoverPassword(service) {
  alert(`Password for ${service} recovered.`);
  closeModal();
  location.reload();
}

function deletePassword(service) {
  alert(`Password for ${service} permanently deleted.`);
  closeModal();
  location.reload();
}

function closeModal() {
  document.getElementById("confirmationModal").classList.add("hidden");
}
