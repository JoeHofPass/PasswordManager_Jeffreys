document.addEventListener("DOMContentLoaded", checkAccountStatus);

function checkAccountStatus() {
  const accountStatus = document.getElementById("accountStatus");
  const username = document.getElementById("accountUsername");
  const email = document.getElementById("accountEmail");

  const getUsername = localStorage.getItem("currentUsername");
  const getEmail = localStorage.getItem("currentUserEmail");
  if (getUsername) username.textContent = getUsername;
  if (getEmail) email.textContent = getEmail;

  const isActive = true; // Set to false for inactive status

  if (!isActive) {
    accountStatus.textContent = "Inactive";
    accountStatus.classList.remove("status-active");
    accountStatus.classList.add("status-inactive");
    alert(
      "Your account is inactive. Please contact support to activate your GateKeep account."
    );
  }
}
