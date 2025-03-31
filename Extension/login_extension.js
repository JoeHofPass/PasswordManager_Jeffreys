document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
  
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
  
    // Replace with actual authentication logic
    if (username === "admin" && password === "password") {
      // Store authentication state
      chrome.storage.local.set({ "isLoggedIn": true }, () => {
        // Redirect to home.html
        window.location.href = "home.html";
      });
    } else {
      alert("Invalid login credentials.");
    }
  });
  