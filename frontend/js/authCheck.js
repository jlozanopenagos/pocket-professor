const API_BACKEND = "http://127.0.0.1:5000/api";

const checkAuthStatus = async () => {
  try {
    const response = await fetch(`${API_BACKEND}/user/profile`, {
      method: "GET",
      credentials: "include",
    });

    if (response.ok) {
      const data = await response.json();
      return { isAuthenticated: true, user: data.user };
    } else {
      return { isAuthenticated: false, user: null };
    }
  } catch (err) {
    console.error("Error al verificar autenticación", err);
    return { isAuthenticated: false, user: null };
  }
};

// actualizar el header segun si esta logueado o no

const updateHeaderUI = (isAuthenticated, user) => {
  const headerActions = document.querySelector(".header-actions");
  if (!headerActions) return;

  if (isAuthenticated && user) {
    headerActions.innerHTML = `
      <div class="header-user-menu">
        <span class="user-email">${user.email}</span>
        <button class="btn btn-secondary" id="logout-btn">Cerrar sesión</button>
      </div>
    `;

    document.getElementById("logout-btn").addEventListener("click", handleLogout);
  } else {
    headerActions.innerHTML = `
      <a href="./html/sections/form-signup.html?mode=login"><button class="btn btn-secondary">Iniciar sesión</button></a>
      <a href="./html/sections/form-signup.html?mode=register"><button class="btn btn-primary">Registrarse</button></a>
    `;
  }
};

const handleLogout = async () => {
  try {
    const response = await fetch(`${API_BACKEND}/user/logout`, {
      method: "POST",
      credentials: "include",
    });

    if (response.ok) {
      console.log("Logout exitoso");
      window.location.href = "./index.html";
    }
  } catch (err) {
    console.error("Error al cerrar sesión", err);
    alert("error al cerrar sesión");
  }
};

const initAuth = async () => {
  document.addEventListener("layouts:loaded", async () => {
    const { isAuthenticated, user } = await checkAuthStatus();
    updateHeaderUI(isAuthenticated, user);
  });
};

// Cuando el documento este listo se ejecuta el inithAuth

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initAuth);
} else {
  initAuth();
}
