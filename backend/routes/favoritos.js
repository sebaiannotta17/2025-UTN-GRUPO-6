import express from "express";
import db from "../db.js";

const router = express.Router();

/**
 * GET /api/favoritos/:usuario_id
 * Obtiene todos los favoritos de un usuario con información de las publicaciones
 */
router.get("/:usuario_id", (req, res) => {
  const { usuario_id } = req.params;

  if (!usuario_id || isNaN(parseInt(usuario_id))) {
    return res.status(400).json({ error: "ID de usuario inválido" });
  }

  try {
    const sql = `
      SELECT 
        f.id as favorito_id,
        f.fecha_agregado,
        p.id,
        p.titulo,
        p.descripcion,
        p.precio,
        p.cantidad,
        p.imagen,
        p.fecha_publicacion,
        p.usuario_id as vendedor_id,
        u.nombre as vendedor_nombre,
        c.nombre as categoria_nombre
      FROM favoritos f
      JOIN publicaciones p ON f.publicacion_id = p.id
      JOIN usuarios u ON p.usuario_id = u.id
      JOIN categorias c ON p.categoria_id = c.id
      WHERE f.usuario_id = ?
      ORDER BY f.fecha_agregado DESC
    `;

    const statement = db.prepare(sql);
    const favoritos = statement.all(usuario_id);

    return res.status(200).json(favoritos);
  } catch (error) {
    console.error("Error al obtener favoritos:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
});

/**
 * POST /api/favoritos
 * Agregar una publicación a favoritos
 * Body: { usuario_id, publicacion_id }
 */
router.post("/", (req, res) => {
  const { usuario_id, publicacion_id } = req.body;

  if (!usuario_id || !publicacion_id || isNaN(parseInt(usuario_id)) || isNaN(parseInt(publicacion_id))) {
    return res.status(400).json({ error: "Datos inválidos" });
  }

  try {
    // Verificar que la publicación existe
    const checkPublicacion = db.prepare("SELECT id FROM publicaciones WHERE id = ?");
    const publicacionExists = checkPublicacion.get(publicacion_id);

    if (!publicacionExists) {
      return res.status(404).json({ error: "Publicación no encontrada" });
    }

    // Verificar que el usuario no esté marcando como favorita su propia publicación
    const checkOwner = db.prepare("SELECT usuario_id FROM publicaciones WHERE id = ?");
    const publicacion = checkOwner.get(publicacion_id);

    if (publicacion.usuario_id === parseInt(usuario_id)) {
      return res.status(400).json({ error: "No puedes marcar como favorita tu propia publicación" });
    }

    // Insertar favorito
    const sql = "INSERT INTO favoritos (usuario_id, publicacion_id) VALUES (?, ?)";
    const statement = db.prepare(sql);
    
    const result = statement.run(usuario_id, publicacion_id);

    return res.status(201).json({ 
      message: "Agregado a favoritos",
      favorito_id: result.lastInsertRowid 
    });

  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return res.status(409).json({ error: "Esta publicación ya está en tus favoritos" });
    }
    console.error("Error al agregar favorito:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
});

/**
 * DELETE /api/favoritos
 * Eliminar una publicación de favoritos
 * Body: { usuario_id, publicacion_id }
 */
router.delete("/", (req, res) => {
  const { usuario_id, publicacion_id } = req.body;

  if (!usuario_id || !publicacion_id || isNaN(parseInt(usuario_id)) || isNaN(parseInt(publicacion_id))) {
    return res.status(400).json({ error: "Datos inválidos" });
  }

  try {
    const sql = "DELETE FROM favoritos WHERE usuario_id = ? AND publicacion_id = ?";
    const statement = db.prepare(sql);
    
    const result = statement.run(usuario_id, publicacion_id);

    if (result.changes === 0) {
      return res.status(404).json({ error: "Favorito no encontrado" });
    }

    return res.status(200).json({ message: "Eliminado de favoritos" });

  } catch (error) {
    console.error("Error al eliminar favorito:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
});

/**
 * GET /api/favoritos/check/:usuario_id/:publicacion_id
 * Verificar si una publicación está en favoritos de un usuario
 */
router.get("/check/:usuario_id/:publicacion_id", (req, res) => {
  const { usuario_id, publicacion_id } = req.params;

  if (!usuario_id || !publicacion_id || isNaN(parseInt(usuario_id)) || isNaN(parseInt(publicacion_id))) {
    return res.status(400).json({ error: "Datos inválidos" });
  }

  try {
    const sql = "SELECT id FROM favoritos WHERE usuario_id = ? AND publicacion_id = ?";
    const statement = db.prepare(sql);
    const favorito = statement.get(usuario_id, publicacion_id);

    return res.status(200).json({ esFavorito: !!favorito });

  } catch (error) {
    console.error("Error al verificar favorito:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
});

export default router;