import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();

const PORT = process.env.PORT || 3000;

// Servir frontend
// app.use(express.static(path.join(__dirname, "../frontend")));

app.use(cors({})); // Esto lo cambiamos a solo la ruta del frontend en producción
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// testing server
app.get("/", (req, res) => {
  res.status(200).json({ message: "testing successful" });
});

// Start server
app.listen(PORT, () => console.log(`Server Running on port: ${PORT}`));
