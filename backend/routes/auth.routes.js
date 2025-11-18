import { supabase } from "../config/supabaseClient";
import { verifyToken } from "../middleware/auth.middleware";
import { Router } from "express";

const router = Router();

// Registro

router.post("/sign-up", async (req, res) => {
  try {
    const { email, password, fullName } = req.body;

    // Validaciones de existencia
    if (!email || !password || !fullName) {
      return res.status(400).json({ error: "Faltan campos requeridos" });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "La contraseña debe tener minimo 6 caracteres" });
    }

    // Crear usuario en Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      return res.status(400).json({ error: "Error registrando al usuario" });
    }

    // Agregando datos del usuario a Supabase
    const { data: userData, error: userError } = await supabase.from("users").insert([
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

    res.status(201).json({
      message: "Usuario correctamente registrado",
      user: authData.user,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
