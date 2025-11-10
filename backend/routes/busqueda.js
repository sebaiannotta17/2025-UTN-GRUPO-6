import express from "express";
const router = express.Router();
import db from "../db.js";

// Buscar publicaciones por título
router.get("/", (req, res) => {
  const q = req.query.q?.trim();

  if (!q) {
    return res
      .status(400)
      .json({ error: "Debe especificar un término de búsqueda." });
  }

  try {
    const stmt = db.prepare(`
      SELECT id, titulo, descripcion, precio, cantidad, imagen, fecha_publicacion, usuario_id
      FROM publicaciones
      WHERE titulo LIKE ?
      ORDER BY fecha_publicacion DESC
    `);
    const results = stmt.all(`%${q}%`);

    res.json({ results });
  } catch (err) {
    console.error("Error al buscar:", err);
    res.status(500).json({ error: "Error interno del servidor." });
  }
});

export default router;
