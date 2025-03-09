document.addEventListener("DOMContentLoaded", checkAccountStatus);

function checkAccountStatus() {
  const accountStatus = document.getElementById("accountStatus");

  // Simulating account status (Replace with actual backend API call)
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
