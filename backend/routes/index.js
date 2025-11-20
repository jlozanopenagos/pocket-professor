import { Router } from "express";
import { authRouter } from "./auth.routes";
import { verifyToken } from "../middleware/auth.middleware";

export const apiRoutes = Router();

// rutas de auth, ('/sign-in') y ('/sign-up')
apiRoutes.use("/auth", authRouter);

// usuarios con sesión iniciada
apiRoutes.get("/profile", verifyToken, (req, res) => {
  res.json({ user: req.user });
});
