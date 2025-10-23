import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

// Servir contenido estático (CSS, JS, imágenes, etc.)
app.use(express.static(path.join(__dirname, "../frontend")));

// Página de inicio (main.html)
app.get("/main.html", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/paginas/main.html"));
});

// Página de búsqueda
app.get("/busqueda.html", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/paginas/Busqueda.html"));
});

// Página de carga/publicación
app.get("/carga.html", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/paginas/Carga.html"));
});

// Página de login
app.get("/login.html", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/paginas/Login.html"));
});

// Página de registro
app.get("/registro.html", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/paginas/registro.html"));
});

// Página de recuperar contraseña
app.get("/recuperar.html", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/paginas/recuperar.html"));
});

// Iniciar servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}/main.html`);
});
