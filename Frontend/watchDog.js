document.addEventListener("DOMContentLoaded", () => {
  const currentUser = localStorage.getItem("currentUserEmail");
  if (!currentUser) {
    window.location.href = "login.html";
  }
});
