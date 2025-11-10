import express from "express";
import db from "../db.js";

const router = express.Router();

/**
 * GET /api/carrito/:usuario_id
 * Obtiene todos los items del carrito de un usuario
 */
router.get("/:usuario_id", (req, res) => {
  const { usuario_id } = req.params;

  if (!usuario_id || isNaN(parseInt(usuario_id))) {
    return res.status(400).json({ error: "ID de usuario inválido" });
  }

  try {
    const sql = `
      SELECT 
        c.id as carrito_id,
        c.cantidad as cantidad_carrito,
        c.fecha_creacion,
        p.id as publicacion_id,
        p.titulo,
        p.descripcion,
        p.precio,
        p.cantidad as stock_disponible,
        p.imagen,
        p.usuario_id as vendedor_id,
        u.nombre as vendedor_nombre,
        cat.nombre as categoria_nombre
      FROM carritos c
      JOIN publicaciones p ON c.publicacion_id = p.id
      JOIN usuarios u ON p.usuario_id = u.id
      JOIN categorias cat ON p.categoria_id = cat.id
      WHERE c.usuario_id = ? AND c.estado = 'activo'
      ORDER BY c.fecha_creacion DESC
    `;

    const statement = db.prepare(sql);
    const carrito = statement.all(usuario_id);

    return res.status(200).json(carrito);
  } catch (error) {
    console.error("Error al obtener carrito:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
});

/**
 * POST /api/carrito
 * Agregar una publicación al carrito
 * Body: { usuario_id, publicacion_id, cantidad }
 */
router.post("/", (req, res) => {
  const { usuario_id, publicacion_id, cantidad = 1 } = req.body;

  if (!usuario_id || !publicacion_id || isNaN(parseInt(usuario_id)) || isNaN(parseInt(publicacion_id))) {
    return res.status(400).json({ error: "Datos inválidos" });
  }

  if (cantidad <= 0) {
    return res.status(400).json({ error: "La cantidad debe ser mayor a 0" });
  }

  try {
    // Verificar que la publicación existe y obtener stock
    const checkPublicacion = db.prepare("SELECT id, cantidad, usuario_id FROM publicaciones WHERE id = ?");
    const publicacion = checkPublicacion.get(publicacion_id);

    if (!publicacion) {
      return res.status(404).json({ error: "Publicación no encontrada" });
    }

    // Verificar que no sea su propia publicación
    if (publicacion.usuario_id === parseInt(usuario_id)) {
      return res.status(400).json({ error: "No puedes agregar tu propia publicación al carrito" });
    }

    // Verificar stock disponible
    if (cantidad > publicacion.cantidad) {
      return res.status(400).json({ error: `Stock insuficiente. Disponible: ${publicacion.cantidad}` });
    }

    // Verificar si ya existe en el carrito
    const checkCarrito = db.prepare("SELECT id, cantidad FROM carritos WHERE usuario_id = ? AND publicacion_id = ? AND estado = 'activo'");
    const itemExistente = checkCarrito.get(usuario_id, publicacion_id);

    if (itemExistente) {
      // Actualizar cantidad existente
      const nuevaCantidad = itemExistente.cantidad + cantidad;
      
      if (nuevaCantidad > publicacion.cantidad) {
        return res.status(400).json({ error: `Stock insuficiente. Disponible: ${publicacion.cantidad}, en carrito: ${itemExistente.cantidad}` });
      }

      const updateSql = "UPDATE carritos SET cantidad = ? WHERE id = ?";
      const updateStatement = db.prepare(updateSql);
      updateStatement.run(nuevaCantidad, itemExistente.id);

      return res.status(200).json({ 
        message: "Cantidad actualizada en el carrito",
        carrito_id: itemExistente.id,
        cantidad_total: nuevaCantidad
      });
    } else {
      // Insertar nuevo item
      const sql = "INSERT INTO carritos (usuario_id, publicacion_id, cantidad) VALUES (?, ?, ?)";
      const statement = db.prepare(sql);
      const result = statement.run(usuario_id, publicacion_id, cantidad);

      return res.status(201).json({ 
        message: "Agregado al carrito",
        carrito_id: result.lastInsertRowid,
        cantidad: cantidad
      });
    }

  } catch (error) {
    console.error("Error al agregar al carrito:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
});

/**
 * PUT /api/carrito/:carrito_id
 * Actualizar cantidad de un item del carrito
 * Body: { cantidad }
 */
router.put("/:carrito_id", (req, res) => {
  const { carrito_id } = req.params;
  const { cantidad } = req.body;

  if (!carrito_id || !cantidad || isNaN(parseInt(carrito_id)) || isNaN(parseInt(cantidad))) {
    return res.status(400).json({ error: "Datos inválidos" });
  }

  if (cantidad <= 0) {
    return res.status(400).json({ error: "La cantidad debe ser mayor a 0" });
  }

  try {
    // Verificar stock disponible
    const checkSql = `
      SELECT c.id, c.publicacion_id, p.cantidad as stock_disponible
      FROM carritos c
      JOIN publicaciones p ON c.publicacion_id = p.id
      WHERE c.id = ? AND c.estado = 'activo'
    `;
    const checkStatement = db.prepare(checkSql);
    const item = checkStatement.get(carrito_id);

    if (!item) {
      return res.status(404).json({ error: "Item del carrito no encontrado" });
    }

    if (cantidad > item.stock_disponible) {
      return res.status(400).json({ error: `Stock insuficiente. Disponible: ${item.stock_disponible}` });
    }

    // Actualizar cantidad
    const sql = "UPDATE carritos SET cantidad = ? WHERE id = ?";
    const statement = db.prepare(sql);
    const result = statement.run(cantidad, carrito_id);

    if (result.changes === 0) {
      return res.status(404).json({ error: "Item del carrito no encontrado" });
    }

    return res.status(200).json({ message: "Cantidad actualizada" });

  } catch (error) {
    console.error("Error al actualizar carrito:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
});

/**
 * DELETE /api/carrito/:carrito_id
 * Eliminar un item del carrito
 */
router.delete("/:carrito_id", (req, res) => {
  const { carrito_id } = req.params;

  if (!carrito_id || isNaN(parseInt(carrito_id))) {
    return res.status(400).json({ error: "ID de carrito inválido" });
  }

  try {
    const sql = "UPDATE carritos SET estado = 'eliminado' WHERE id = ? AND estado = 'activo'";
    const statement = db.prepare(sql);
    const result = statement.run(carrito_id);

    if (result.changes === 0) {
      return res.status(404).json({ error: "Item del carrito no encontrado" });
    }

    return res.status(200).json({ message: "Item eliminado del carrito" });

  } catch (error) {
    console.error("Error al eliminar del carrito:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
});

/**
 * DELETE /api/carrito/usuario/:usuario_id
 * Vaciar todo el carrito de un usuario
 */
router.delete("/usuario/:usuario_id", (req, res) => {
  const { usuario_id } = req.params;

  if (!usuario_id || isNaN(parseInt(usuario_id))) {
    return res.status(400).json({ error: "ID de usuario inválido" });
  }

  try {
    const sql = "UPDATE carritos SET estado = 'eliminado' WHERE usuario_id = ? AND estado = 'activo'";
    const statement = db.prepare(sql);
    const result = statement.run(usuario_id);

    return res.status(200).json({ 
      message: "Carrito vaciado",
      items_eliminados: result.changes
    });

  } catch (error) {
    console.error("Error al vaciar carrito:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
});

export default router;