import express from "express"; // 1. Cambiar require por import
import db from "../db.js"; // 1. Cambiar require por import y añadir la extensión .js

const router = express.Router();

// ✅ Obtener todos los materiales
router.get("/", (req, res) => {
  try {
    const rows = db.prepare("SELECT * FROM publicacion").all();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Crear un nuevo material
router.post("/", (req, res) => {
  try {
    const {
      nombre,
      descripcion,
      precio,
      cantidad,
      categoria,
      subcategoria1,
      subcategoria2,
    } = req.body;

    const stmt = db.prepare(`
      INSERT INTO materiales
      (nombre, descripcion, precio, cantidad, categoria, subcategoria1, subcategoria2)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const info = stmt.run(
      nombre,
      descripcion,
      precio,
      cantidad,
      categoria,
      subcategoria1,
      subcategoria2,
    );

    res.json({ success: true, id: info.lastInsertRowid });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Cambiar module.exports por export default
export default router;
