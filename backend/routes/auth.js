import express from "express";
const router = express.Router();
import db from "../db.js";

// Login usuario
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
      celular: user.celular,
      fecha_registro: user.fecha_registro,
    },
  });
});

// Registro usuario
router.post("/register", (req, res) => {
  const { nombre, email, password, celular } = req.body;

  if (!nombre || !email || !password)
    return res.status(400).json({ error: "Faltan datos" });

  const existe = db
    .prepare("SELECT * FROM usuarios WHERE email = ?")
    .get(email);
  if (existe)
    return res.status(400).json({ error: "El email ya está registrado" });

  const fecha = new Date().toISOString().slice(0, 19).replace("T", " ");
  const insert = db.prepare(`
    INSERT INTO usuarios (nombre, email, password, fecha_registro, celular)
    VALUES (?, ?, ?, ?, ?)
  `);
  const result = insert.run(nombre, email, password, fecha, celular || null);

  const user = db
    .prepare("SELECT * FROM usuarios WHERE id = ?")
    .get(result.lastInsertRowid);

  res.status(201).json({
    message: "Usuario registrado correctamente",
    usuario: user,
  });
});

// Actualizar perfil
router.put("/update/:id", (req, res) => {
  const { id } = req.params;
  const { nombre, email, celular, passwordActual, passwordNueva } = req.body;

  const user = db.prepare("SELECT * FROM usuarios WHERE id = ?").get(id);
  if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

  // Si se quiere cambiar la contraseña, validar la actual
  if (passwordActual && passwordNueva) {
    if (user.password !== passwordActual) {
      return res.status(400).json({ error: "La contraseña actual es incorrecta" });
    }
    
    // Actualizar con nueva contraseña
    const update = db.prepare(
      "UPDATE usuarios SET nombre = ?, email = ?, celular = ?, password = ? WHERE id = ?",
    );
    update.run(nombre, email, celular || null, passwordNueva, id);
  } else {
    // Actualizar sin cambiar contraseña
    const update = db.prepare(
      "UPDATE usuarios SET nombre = ?, email = ?, celular = ? WHERE id = ?",
    );
    update.run(nombre, email, celular || null, id);
  }

  res.json({ message: "Usuario actualizado correctamente" });
});

// Eliminar cuenta
router.delete("/delete/:id", (req, res) => {
  const { id } = req.params;
  const { password } = req.body;

  const user = db.prepare("SELECT * FROM usuarios WHERE id = ?").get(id);
  if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

  // Verificar contraseña
  if (user.password !== password) {
    return res.status(401).json({ error: "Contraseña incorrecta" });
  }

  db.prepare("DELETE FROM usuarios WHERE id = ?").run(id);
  res.json({ message: "Usuario eliminado correctamente" });
});

export default router;
