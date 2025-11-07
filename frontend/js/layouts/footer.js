// Función para cargar footer automaticamente
document.addEventListener("DOMContentLoaded", () => {
  fetch("html/layouts/footer.html")
    .then(response => response.text())
    .then(data => {
      document.getElementById("footer-container").innerHTML = data;
    })
    .catch(error => console.error("Error loading footer:", error));
});
