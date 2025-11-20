import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";
// rutas del /routes/index
import { apiRoutes } from "./routes";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors({})); // Esto lo cambiamos a solo la ruta del frontend en producción
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// rutas api
app.use("/api", apiRoutes);

// Servir frontend
// app.use(express.static(path.join(__dirname, "../frontend")));

// testing server
app.get("/", (req, res) => {
  res.status(200).json({ message: "testing successful" });
});

// Ruta fallback para SPA - ESTO DEBE IR SIEMPRE AL FINAL
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// manejo de errores globales
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Algo salio mal en el servidor" });
});

// Start server
app.listen(PORT, () => console.log(`Server Running on port: ${PORT}`));
