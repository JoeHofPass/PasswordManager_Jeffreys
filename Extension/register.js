document.addEventListener('DOMContentLoaded', () => {
  document.getElementById("password").addEventListener("keypress"), ( ) => {
    const password = document.getElementById("password").value;
    const strengthBar = document.getElementById("strength-bar");

    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;

    // Update strength bar width and color
    strengthBar.style.width = strength + "%";
    strengthBar.style.backgroundColor =
      strength < 50 ? "#e74c3c" : strength < 75 ? "#f1c40f" : "#2ecc71";
  }

  document.getElementById("confirm-password").addEventListener("keypress"), () => {
    const password = document.getElementById("password").value;
    const confirmPassword =
      document.getElementById("confirm-password").value;
    const passwordMatch = document.getElementById("password-match");

    if (password.length === 0 || confirmPassword.length === 0) {
      passwordMatch.style.display = "none";
      return;
    }

    if (password === confirmPassword) {
      passwordMatch.textContent = "✅ Passwords match";
      passwordMatch.className = "password-match match";
      passwordMatch.style.display = "block";
    } else {
      passwordMatch.textContent = "❌ Passwords do not match";
      passwordMatch.className = "password-match nomatch";
      passwordMatch.style.display = "block";
    }
  }
})