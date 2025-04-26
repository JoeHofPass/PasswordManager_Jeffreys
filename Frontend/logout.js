function logout() {
    window.electron.once("logout-response", (response) => {
      if (response === "success") {
        console.log("Logout successful. Redirecting to login page.");
        localStorage.clear();
        window.location.href = "login.html";
      } else console.log("Logout failed. Please try again.");
    });
    window.electron.send("logout");

}