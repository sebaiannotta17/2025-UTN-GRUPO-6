import express from "express";
const router = express.Router();
import db from "../db.js";

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  const user = db.prepare("SELECT * FROM usuarios WHERE email = ?").get(email);
  if (!user) return res.status(400).json({ error: "Usuario no encontrado" });

  if (user.password !== password)
    return res.status(401).json({ error: "Contraseña incorrecta" });

  res.status(200).json({
    message: "Login exitoso",
    usuario: {
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      fecha_registro: user.fecha_registro,
    },
  });
});

router.post("/register", (req, res) => {
  const { nombre, email, password } = req.body;
  if (!nombre || !email || !password)
    return res.status(400).json({ error: "Faltan datos" });

  const existe = db
    .prepare("SELECT * FROM usuarios WHERE email = ?")
    .get(email);
  if (existe)
    return res.status(400).json({ error: "El email ya está registrado" });

  const fecha = new Date().toISOString().slice(0, 19).replace("T", " ");
  const insert = db.prepare(
    "INSERT INTO usuarios (nombre, email, password, fecha_registro) VALUES (?, ?, ?, ?)",
  );
  insert.run(nombre, email, password, fecha);

  return res.status(201).json({ message: "Usuario registrado correctamente" });
});

export default router;
