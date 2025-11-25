//forms for send data to backend
const formSignUp = document.getElementById("form-signup");
const formSignIn = document.getElementById("form-signin");

//animation form
const container = document.getElementById("container");
const registerBtn = document.getElementById("register");
const loginBtn = document.getElementById("login");

// leer parametros URL para determinar que formulario mostrar
const urlParams = new URLSearchParams(window.location.search);
const mode = urlParams.get("mode");

if (mode === "register") {
  container.classList.add("active");
} else if (mode === "login") {
  container.classList.remove("active");
}

registerBtn.addEventListener("click", () => {
  container.classList.add("active");
});

loginBtn.addEventListener("click", () => {
  container.classList.remove("active");
});

// Conectar endpoint de backend al formulario

const API_BACKEND = "http://localhost:5000/api";

// SignUp Function
const signUp = async (email, password, fullName) => {
  try {
    const response = await fetch(`${API_BACKEND}/auth/sign-up`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, fullName }),
    });

    const data = await response.json();

    if (!response.ok) {
      // console.error("Problemas al hacer el POST del signUp");
      throw new Error(data.error || "Error del POST signUp");
    }

    return data;
  } catch (error) {
    console.error("Error al registrarse en el front", error);
    alert(error.message);
  }
};

// SignIn Function
const signIn = async (email, password) => {
  try {
    const response = await fetch(`${API_BACKEND}/auth/sign-in`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      // console.error("Problemas al hacer el POST del signIn");
      throw new Error(data.error || "Error del POST signIn");
    }

    return data;
  } catch (error) {
    console.error("Error al loguearse en el front", error);
    alert(error.message);
  }
};

// SignUp eventListener

formSignUp.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Saca los datos del form
  const form = e.target;
  const formData = new FormData(form);
  const { email, password, fullName } = Object.fromEntries(formData);

  try {
    await signUp(email, password, fullName);
    console.log("Cuenta creada con exito");
    form.reset();
    //redirigir
    // window.location.href = "/pocket-professor/frontend/index.html";
  } catch (err) {
    alert(err.message);
  }
});

// Login eventListener

formSignIn.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Saca los datos del form
  const form = e.target;
  const formData = new FormData(form);
  const { email, password } = Object.fromEntries(formData);

  try {
    await signIn(email.trim(), password);
    console.log("logueado con exito");
    form.reset();
    // redirigir
    // window.location.href = "/pocket-professor/frontend/index.html";
  } catch (err) {
    console.error("Error en login", err);
    alert(err.message);
  }
});
