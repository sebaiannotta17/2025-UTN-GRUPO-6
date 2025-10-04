import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

import materialesRoutes from "./routes/materiales.js";
app.use("/api/materiales", materialesRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "¡Bienvenido a la API de Materiales! El servidor está operativo.",
    documentation: "Visita /docs para la documentación (si la tienes).",
    endpoint: "Para acceder a los datos, usa /api/materiales",
  });
});

app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
