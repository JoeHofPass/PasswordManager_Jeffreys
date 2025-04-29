document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.local.get("loggedIn", (data) => {
      if (!data.loggedIn) {
        window.location.href = "login_extension.html"
      }
    })

    document.getElementById("logout")?.addEventListener("click", () => {
      chrome.storage.local.set({ loggedIn: false }, () => {
        window.location.href = "login_extension.html"
      })
    })

    document.getElementById("openPasswordPopup").addEventListener("click", () => {
      if (
        document.getElementById("siteName") &&
        document.getElementById("userEmail") &&
        document.getElementById("generatedPassword")
      ) {
        document.getElementById("siteName").value = "";
        document.getElementById("userEmail").value = "";
        document.getElementById("generatedPassword").value = "";
      }
      document.getElementById("passwordPopup").style.display = "block"
    })

    document.getElementById("closePasswordPopup").addEventListener("click", () => {
      document.getElementById("passwordPopup").style.display = "none";
    }) 

    document.getElementById("genPassword").addEventListener("click", () => {
      const length = 16;
      const chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
      let password = "";
      for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      document.getElementById("generatedPassword").value = password;
    })
  })