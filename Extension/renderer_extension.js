document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.local.get("loggedIn", (data) => {
    if (data.loggedIn) {
      window.location.href = "home_extension.html"
    }
  })

  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");
  const passwordPopup = document.getElementById("passwordPopup");
  const accounts = document.getElementById("accountList");

  const current = localStorage.getItem("currentUserEmail");
  if (current && accounts) {
      window.electron.send("get-passwords", { email: current });
  }

  if (loginForm) {
      document.getElementById("login")?.addEventListener("click", () => {
      const email = document.getElementById("email").value
      const password = document.getElementById("password").value

      if (email && password) {
        chrome.storage.local.set({ loggedIn: true }, () => {
          window.location.href = "home_extension.html"
        })
      }
      else {
        alert("Enter email and password")
      }
    })
  }
})