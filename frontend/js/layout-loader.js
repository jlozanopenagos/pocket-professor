// === CONFIGURACIÓN: Mapea contenedores → archivos HTML ===
const LAYOUTS = {
  "header-container": "/pocket-professor/frontend/html/layouts/header.html",
  "hero-main": "/pocket-professor/frontend/html/sections/hero.html",
  "simuladores-container": "/pocket-professor/frontend/html/sections/simulators.html",
  "footer-container": "/pocket-professor/frontend/html/layouts/footer.html"
};

// === CACHÉ SIMPLE (evita recargar el mismo archivo) ===
const cache = new Map();

/**
 * Carga HTML con caché
 */
async function loadHTML(path) {
  if (cache.has(path)) return cache.get(path);

  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`Error ${res.status}`);
    const html = await res.text();
    cache.set(path, html);
    return html;
  } catch (err) {
    console.error(`[LayoutLoader] No se pudo cargar: ${path}`, err);
    return `<p style="color:red; padding:1rem;">Error al cargar componente</p>`;
  }
}

/**
 * Renderiza un layout en su contenedor
 */
async function renderLayout(containerId, filePath) {
  const container = document.getElementById(containerId);
  if (!container) {
    return;
  }

  // Opcional: placeholder mientras carga
  container.innerHTML = `<div style="min-height:2rem; background:#f0f0f0; border-radius:4px;"></div>`;

  const html = await loadHTML(filePath);

  // Usa template para insertar correctamente (incluye scripts si hay)
  const template = document.createElement("template");
  template.innerHTML = html.trim();
  container.innerHTML = ""; // Limpia placeholder
  container.appendChild(template.content);

  // Ejecuta scripts internos (útil para componentes con JS)
  // container.querySelectorAll("script").forEach((oldScript) => {
  //   const newScript = document.createElement("script");
  //   newScript.text = oldScript.text;
  //   // Copia src si es externo
  //   if (oldScript.src) newScript.src = oldScript.src;
  //   oldScript.parentNode.replaceChild(newScript, oldScript);
  // });
}

/**
 * Carga TODOS los layouts al cargar la página
 */
async function initLayouts() {
  const tasks = Object.entries(LAYOUTS).map(
    ([id, path]) => renderLayout(id, path).catch(() => { }) // Un error no rompe todo
  );

  await Promise.all(tasks);

  // Evento global: otros scripts pueden reaccionar
  document.dispatchEvent(new Event("layouts:loaded"));
}

// === INICIO AUTOMÁTICO ===
document.addEventListener("DOMContentLoaded", () => {
  // Pequeño retraso para evitar FOUC
  requestAnimationFrame(initLayouts);
});
