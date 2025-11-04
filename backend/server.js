import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import publicacionesRoutes from "./routes/publicaciones.js";
import authRoutes from "./routes/auth.js";
import busquedaRoutes from "./routes/busqueda.js";
import categoriasRouter from "./routes/categorias.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

// Servir carpetas estáticas del frontend
app.use(express.static(path.join(__dirname, "../frontend/paginas")));
app.use("/css", express.static(path.join(__dirname, "../frontend/css")));
app.use("/js", express.static(path.join(__dirname, "../frontend/js")));
app.use("/imgs", express.static(path.join(__dirname, "../frontend/imgs")));

// Rutas de la API
app.use("/api/publicaciones", publicacionesRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/busqueda", busquedaRoutes);
app.use("/api/categorias", categoriasRouter);

// Iniciar servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}/main.html`);
});
