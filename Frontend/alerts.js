document.addEventListener("DOMContentLoaded", () => {
  // Trigger password security check when the page is loaded
  //localStorage.setItem("currentUserEmail", email);
  const curr = localStorage.getItem("currentUserEmail");
  loadWeakPasswordsFromFile(
    "https://raw.githubusercontent.com/danielmiessler/SecLists/refs/heads/master/Passwords/Common-Credentials/10-million-password-list-top-100000.txt",
    curr
  );

  function loadWeakPasswordsFromFile(url, email) {
    fetch(url)
      .then((response) => response.text())
      .then((data) => {
        const weakPasswords = data.split("\n").map((p) => p.trim());
        window.electron.send("get-passwords", { email: curr });

        window.electron.on("get-passwords-response", (passwords) => {
          checkSecurityIssues(weakPasswords, passwords);
        });
      })
      .catch((error) => {
        console.error("Error loading weak password file:", error);
      });
  }

  function checkSecurityIssues(weakPasswords, passwords) {
    const alertMessages = document.getElementById("alertMessages");
    alertMessages.innerHTML = ""; // Clear previous alerts

    const passwordCounts = {};
    let hasWeakPassword = false;
    let hasDuplicatePasswords = false;

    passwords.forEach(({ service, password }) => {
      if (weakPasswords.includes(password)) {
        hasWeakPassword = true;
        createAlertMessage(
          `🚨 Weak password detected for ${service}. Please update your password immediately.`,
          "critical"
        );
      }

      if (!passwordCounts[password]) {
        passwordCounts[password] = [];
      }
      passwordCounts[password].push(service);
    });

    // Check for duplicate passwords
    Object.entries(passwordCounts).forEach(([password, service]) => {
      if (service.length > 1) {
        hasDuplicatePasswords = true;
        createAlertMessage(
          `⚠️ The password used for ${service.join(
            ", "
          )} is reused across these accounts. This is a major security risk!`,
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
      alertDiv.classList.add("critical");
    } else if (type === "warning") {
      alertDiv.classList.add("warning");
    } else {
      alertDiv.classList.add("safe");
    }

    alertDiv.innerHTML = message;
    alertMessages.appendChild(alertDiv);
  }
});
