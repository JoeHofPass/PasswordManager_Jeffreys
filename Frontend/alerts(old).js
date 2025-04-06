document.addEventListener("DOMContentLoaded", checkSecurityIssues);

function checkSecurityIssues() {
  const alertMessages = document.getElementById("alertMessages");
  alertMessages.innerHTML = ""; // Clear previous alerts

  const storedPasswords = [
    { site: "Amazon", email: "user@example.com", password: "123password" },
    { site: "Google", email: "john.doe@gmail.com", password: "SecurePass123!" },
    {
      site: "Facebook",
      email: "jane.doe@facebook.com",
      password: "123password",
    },
    { site: "Twitter", email: "user@twitter.com", password: "SecurePass123!" },
  ]; // Simulated password data, replace with actual stored passwords

  const passwordCounts = {};
  let hasWeakPassword = false;
  let hasDuplicatePasswords = false;

  const weakPasswords = [
    "123456",
    "password",
    "123password",
    "qwerty",
    "admin",
    "letmein",
  ];

  storedPasswords.forEach(({ site, password }) => {
    if (weakPasswords.includes(password)) {
      hasWeakPassword = true;
      createAlertMessage(
        `🚨 Weak password detected for <strong>${site}</strong>. Please update your password immediately.`,
        "critical"
      );
    }

    if (!passwordCounts[password]) {
      passwordCounts[password] = [];
    }
    passwordCounts[password].push(site);
  });

  Object.entries(passwordCounts).forEach(([password, sites]) => {
    if (sites.length > 1) {
      hasDuplicatePasswords = true;
      createAlertMessage(
        `⚠️ The password used for <strong>${sites.join(
          ", "
        )}</strong> is reused across multiple accounts. This is a major security risk!`,
        "warning"
      );
    }
  });

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

  // Add appropriate class for alert type
  if (type === "critical") {
    alertDiv.classList.add("critical-alert");
  } else if (type === "warning") {
    alertDiv.classList.add("warning-alert");
  } else {
    alertDiv.classList.add("safe-alert");
  }

  alertDiv.innerHTML = message;
  alertMessages.appendChild(alertDiv);
}
