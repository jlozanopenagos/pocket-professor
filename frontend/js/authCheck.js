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
      <button class="btn-profile" id="btn-profile"><i class="fa-solid fa-user"></i></button>
      <div class="hidden-data">
        <div class="menu-items"><i class="fa-regular fa-user"></i><span class="menu-item user-email">${user.email}</span></div>
        <div class="menu-items" id="logout-btn"><i class="fa-solid fa-arrow-right-from-bracket"></i> <span class="menu-item">Cerrar sesión</span> </div>
      </div>
    `;

    document.getElementById("btn-profile").addEventListener("click", showProfileUser);
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

const showProfileUser = () => {
  const profileUser = document.querySelector(".hidden-data");
  profileUser.classList.toggle("visible-data");
};

// Cuando el documento este listo se ejecuta el inithAuth

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initAuth);
} else {
  initAuth();
}
