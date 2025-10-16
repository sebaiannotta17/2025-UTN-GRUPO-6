import express from "express";
import cors from "cors";
import publicacionesRoutes from "./routes/publicaciones.js";
import authRoutes from "./routes/auth.js"; // 👈 nueva importación

const app = express();
const PORT = 3000;

// Permite peticiones desde el frontend
app.use(cors());

// Permite leer JSON del body
app.use(express.json());

// Rutas de la API
app.use("/api/publicaciones", publicacionesRoutes);
app.use("/api/auth", authRoutes); // 👈 nueva ruta de autenticación

// Inicio del servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
