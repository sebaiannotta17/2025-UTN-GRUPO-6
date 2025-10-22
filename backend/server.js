import express from "express";
import cors from "cors";
import path from "path";

const app = express();
const __dirname = path.resolve();

app.use(cors());
app.use(express.json());

// Servir los archivos del frontend
app.use(express.static(path.join(__dirname, "frontend")));

// Ruta raíz -> muestra el index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend/paginas/main.html"));
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
