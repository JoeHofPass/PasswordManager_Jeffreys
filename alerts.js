document.addEventListener("DOMContentLoaded", () => {
  // Trigger password security check when the page is loaded
  loadWeakPasswordsFromFile('https://raw.githubusercontent.com/danielmiessler/SecLists/refs/heads/master/Passwords/Common-Credentials/10-million-password-list-top-100000.txt');
});

function loadWeakPasswordsFromFile(url) {
  fetch(url)
    .then(response => response.text())
    .then(data => {
      const weakPasswords = data.split("\n").map(p => p.trim());
      checkSecurityIssues(weakPasswords);
    })
    .catch(error => {
      console.error("Error loading weak password file:", error);
    });
}

function checkSecurityIssues(weakPasswords) {
  const alertMessages = document.getElementById("alertMessages");
  alertMessages.innerHTML = ""; // Clear previous alerts

  const storedPasswords = [
    { site: "Amazon", email: "user@example.com", password: "123password" },
    { site: "Google", email: "john.doe@gmail.com", password: "SecurePass123!" },
    { site: "Facebook", email: "jane.doe@facebook.com", password: "123password" },
    { site: "Twitter", email: "user@twitter.com", password: "SecurePass123!" },
  ]; // Simulated password data, replace with actual stored passwords

  const passwordCounts = {};
  let hasWeakPassword = false;
  let hasDuplicatePasswords = false;

  storedPasswords.forEach(({ site, password }) => {
    if (weakPasswords.includes(password)) {
      hasWeakPassword = true;
      createAlertMessage(
        `🚨 Weak password detected for ${site}. Please update your password immediately.`,
        "critical"
      );
    }

    if (!passwordCounts[password]) {
      passwordCounts[password] = [];
    }
    passwordCounts[password].push(site);
  });

  // Check for duplicate passwords
  Object.entries(passwordCounts).forEach(([password, sites]) => {
    if (sites.length > 1) {
      hasDuplicatePasswords = true;
      createAlertMessage(
        `⚠️ The password used for ${sites.join(", ")} is reused across multiple accounts. This is a major security risk!`,
        "warning"
      );
    }
  });

  // If no issues, display a safe message
  if (!hasWeakPassword && !hasDuplicatePasswords) {
    createAlertMessage(
      "✅ No security vulnerabilities detected. Your passwords are safe!",
      "safe"
    );
  }
}

function createAlertMessage(message, type) {
  const alertMessages = document.getElementById("alertMessages");
  const alertDiv = document.createElement("div");
  alertDiv.classList.add("alert-message");

  if (type === "critical") {
    alertDiv.style.background = "#ee2e31"; // Red for critical alerts
  } else if (type === "warning") {
    alertDiv.style.background = "#ffcc00"; // Yellow for warnings
  } else {
    alertDiv.style.background = "#28a745"; // Green for safe status
  }

  alertDiv.innerHTML = message;
  alertMessages.appendChild(alertDiv);
}
