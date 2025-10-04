import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import publicacionesRoutes from "./routes/publicaciones.js";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// Rutas
app.use("/api/publicaciones", publicacionesRoutes);

app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
