import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { fileURLToPath } from "url";
import path from "path";
dotenv.config();

import { refreshSession } from "./middleware/refreshSession.middleware.js";
import { verifyToken } from "./middleware/auth.middleware.js";
import { authRouter } from "./routes/auth.routes.js";
import { userRouter } from "./routes/user.routes.js";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// rutas api/auth antes de middlewares
app.use("/api/auth", authRouter);

// Middleware renovación de sesión y verificación
app.use(refreshSession);
app.use(verifyToken);

// rutas usuario despues de los middlewares
app.use("/api/user", userRouter);

// Servir frontend
// app.use(express.static(path.join(__dirname, "../frontend")));

// testing server
app.get("/", (req, res) => {
  res.status(200).json({ message: "testing successful" });
});

// Ruta fallback para SPA - ESTO DEBE IR SIEMPRE AL FINAL

// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "../frontend/index.html"));
// });

// manejo de errores globales
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Algo salio mal en el servidor" });
});

// Start server
app.listen(PORT, () => console.log(`Server Running on port: ${PORT}`));
