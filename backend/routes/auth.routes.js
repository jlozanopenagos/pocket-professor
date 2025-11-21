import { supabase } from "../config/supabaseClient.js";
import { Router } from "express";

export const authRouter = Router();

// Registro
authRouter.post("/sign-up", async (req, res) => {
  try {
    const { email, password, fullName } = req.body;

    // Validaciones de existencia de datos
    if (!email || !password || !fullName) {
      return res.status(400).json({ error: "Faltan campos requeridos" });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "La contraseña debe tener minimo 6 caracteres" });
    }
    // Verificar si usuario existe
    const { data: existingUser } = await supabase.from("users").select("email").eq("email", email).maybeSingle();

    if (existingUser) {
      return res.status(409).json({ error: "El email ingresado ya fue registrado" });
    }

    // Crear usuario en Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      console.log(authError);
      return res.status(400).json({ error: "Error registrando al usuario" });
    }

    // tomar session que regresa el signup para autologgeo
    const session = authData.session;

    // Agregando datos del usuario a Supabase
    const { error: userError } = await supabase.from("users").insert([
      {
        id: authData.user.id,
        email: email,
        name: fullName,
        // created_at: new Date()  // ESTO NO SE MANDA PORQUE ESTA COMO DEFAULT EN SUPABASE
      },
    ]);

    if (userError) {
      return res.status(400).json({ error: userError.message });
    }

    //AUTO-LOGIN despues de insert a supabase
    if (session) {
      // Guardar JWT en http only para mayor seguridad
      res.cookie("sb-access-token", session.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // esto puede dar error por el dotenv
        sameSite: "lax",
        maxAge: session.expires_in * 1000,
      });

      res.cookie("sb-refresh-token", session.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 60 * 1000, // es en milisegundos entonces pasamos 6o dias a miliseconds
      });
    }

    res.status(201).json({
      message: "Usuario correctamente registrado",
      user: {
        id: authData.user.id,
        email: authData.user.email,
        name: fullName,
      },
    });
  } catch (error) {
    console.log("error registrando", error);
    res.status(500).json({ error: error.message });
  }
});

// loggeo
authRouter.post("/sign-in", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email y password requeridas" });
    }

    // Verificar que el usuario exista
    const { data: existingUser } = await supabase.from("users").select("email").eq("email", email).maybeSingle();

    if (!existingUser) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    // sing in
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.log(error);
      return res.status(401).json({ error: "Error iniciando sesión" });
    }

    const session = data.session;

    if (session) {
      res.cookie("sb-access-token", session.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: session.expires_in * 1000,
      });

      res.cookie("sb-refresh-token", session.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 60 * 1000,
      });
    }

    res.status(200).json({
      message: "Sesión iniciada",
      session: data.session,
      user: {
        id: data.user.id,
        email: data.user.email,
      },
    });
  } catch (error) {
    console.error("Error iniciando sesión", error);
    res.status(500).json({ error: error.message });
  }
});
