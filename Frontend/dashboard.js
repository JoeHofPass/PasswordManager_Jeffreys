document.addEventListener("DOMContentLoaded", function () {
  const searchBar = document.getElementById("searchBar");

  searchBar.addEventListener("input", function () {
    let filter = searchBar.value.toLowerCase();
    let cards = document.querySelectorAll(".account-card");

    cards.forEach((card) => {
      let siteName = card.querySelector("strong").innerText.toLowerCase();
      let userEmail = card.querySelector("p").innerText.toLowerCase();

      // Show only cards that match the search term
      if (siteName.includes(filter) || userEmail.includes(filter)) {
        card.style.display = "flex"; // Show matching results
      } else {
        card.style.display = "none"; // Hide non-matching results
      }
    });
  });
});
