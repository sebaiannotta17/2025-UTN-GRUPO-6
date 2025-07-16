import express from "express";
import { cargarPelicula, eliminarTodo, recuperarPeliculas } from "./services/strapi.js";
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

// Configuracion de la api

const allowedOrigins = process.env.ALLOWED_ORIGINS
const corsOptions = {
    origin: '*', 
    credentials: true,
    sameSite: "None"
  }
  
const port = 3000;
const app = express()

app.use(cors(corsOptions))
app.use(express.json());


app.get("/", (req, res) => {
  res.send("Hola desde el puerto 3000");
});

//endpoint que consulta la api y sube el contenido al strapi
app.get("/cargar-matrix", async (req, res) => {
  try {
    const resultado = await cargarPelicula();
    res.status(200).json({ mensaje: "Película cargada", data: resultado });
  } catch (err) {
    res.status(500).json({ error: "Algo falló", detalle: err.message });
  }
});

//endpoint para recuperar la peli del strapi
app.get("/recuperar-matrix", async (req, res) => {
  try {
    const resultado = await recuperarPeliculas();
    res.status(200).json({ mensaje: "Películas:", data: resultado });
  } catch (err) {
    res.status(500).json({ error: "Algo falló", detalle: err.message });
  }
});
app.delete("/eliminar-todo", async (req, res)=>{
  try {
    await eliminarTodo();
    res.status(200).json({ mensaje: "Peliculas eliminadas"});
  } catch (err) {
    res.status(500).json({ error: "Algo falló", detalle: err.message });
  }
})

app.listen(port,'0.0.0.0', () => {
  console.log(`Servidor backend escuchando en puerto ${port}`);
});
