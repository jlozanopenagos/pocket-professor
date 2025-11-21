import { Router } from "express";
import { supabase } from "../config/supabaseClient.js";

export const userRouter = Router();

userRouter.get("/profile", (req, res) => {
  res.json({ user: req.user });
});

userRouter.post("/logout", async (req, res) => {
  try {
    const refreshToken = req.cookies["sb-refresh-token"];

    if (refreshToken) {
      await supabase.auth.signOut({
        refreshToken,
      });

      res.clearCookie("sb-access-token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });

      res.clearCookie("sb-refresh-token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });

      res.status(200).json({ message: "Logout exitoso" });
    }
  } catch (error) {
    console.error("Error en logOut", error);
  }
});
