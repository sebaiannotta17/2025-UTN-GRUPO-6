import express from "express";
import db from "../db.js";

const router = express.Router();

// Obtener todas las publicaciones
router.get("/", (req, res) => {
  try {
    const stmt = db.prepare(`
      SELECT p.*, u.nombre AS usuario, c.nombre AS categoria, s1.nombre AS subcategoria1, s2.nombre AS subcategoria2
      FROM publicaciones p
      JOIN usuarios u ON p.usuario_id = u.id
      JOIN categorias c ON p.categoria_id = c.id
      LEFT JOIN subcategorias s1 ON p.subcategoria1_id = s1.id
      LEFT JOIN subcategorias s2 ON p.subcategoria2_id = s2.id
      ORDER BY p.fecha_publicacion DESC
    `);
    const publicaciones = stmt.all();
    res.json(publicaciones);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Crear nueva publicación
router.post("/", (req, res) => {
  console.log("Body recibido:", req.body);

  const {
    usuario_id,
    categoria_id,
    subcategoria1_id,
    subcategoria2_id,
    titulo,
    descripcion,
    precio,
    cantidad,
    imagen,
  } = req.body;

  try {
    const stmt = db.prepare(`
      INSERT INTO publicaciones (
        usuario_id, categoria_id, subcategoria1_id, subcategoria2_id,
        titulo, descripcion, precio, cantidad, imagen
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const info = stmt.run(
      usuario_id,
      categoria_id,
      subcategoria1_id,
      subcategoria2_id,
      titulo,
      descripcion,
      precio,
      cantidad,
      imagen,
    );

    res.json({ success: true, id: info.lastInsertRowid });
  } catch (err) {
    console.error("Error insertando:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
