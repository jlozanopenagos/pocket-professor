import { supabase } from "../config/supabaseClient.js";

export const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies["sb-access-token"];

    if (!token) return res.status(401).json({ error: "No token (cookie)" });

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: "Token invalido!" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Problemas con la verificación del token del usuario", error);
    res.status(500).json({ error: "Problemas con la autenticación" });
  }
};
