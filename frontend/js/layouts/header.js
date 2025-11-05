// Función para cargar HTML dinámicamente
async function loadHTML(elementId, filePath) {
  try {
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`Error loading ${filePath}: ${response.status}`);
    }
    const html = await response.text();
    const element = document.getElementById(elementId);
    if (element) {
      element.innerHTML = html;
    } else {
      console.error(`Element with id "${elementId}" not found`);
    }
  } catch (error) {
    console.error("Error loading HTML:", error);
  }
}

function initComponents() {
  loadHTML("header-container", "html/layouts/header.html");
}

document.addEventListener("DOMContentLoaded", initComponents);
