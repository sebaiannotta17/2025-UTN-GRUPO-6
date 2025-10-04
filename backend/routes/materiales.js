import express from "express";
import db from "../db.js";

const router = express.Router();

router.get("/", (req, res) => {
  try {
    const rows = db.prepare("SELECT * FROM publicacion").all();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

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

export default router;
