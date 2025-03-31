document.addEventListener('DOMContentLoaded', () => {
    // Check if the user is logged in
    chrome.storage.local.get("isLoggedIn", (data) => {
      if (!data.isLoggedIn) {
        window.location.href = "popup.html"; // Redirect to login if not logged in
      }
    });
  
    // Logout functionality
    document.getElementById('logout').addEventListener('click', () => {
      chrome.storage.local.set({ "isLoggedIn": false }, () => {
        window.location.href = "popup.html";  // Redirect to login page
      });
    });
  });
  