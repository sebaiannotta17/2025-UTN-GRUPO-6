import express from "express";
import db from "../db.js";

const router = express.Router();

// Insertar publicación con validaciones
router.post("/", (req, res) => {
  const {
    usuario_id,
    categoria_id,
    subcategoria1_id = null,
    subcategoria2_id = null,
    titulo,
    descripcion,
    precio,
    cantidad,
    imagen = null,
  } = req.body;

  try {
    // Validaciones básicas
    if (
      !usuario_id ||
      !categoria_id ||
      !titulo ||
      !descripcion ||
      !precio ||
      !cantidad
    ) {
      return res.status(400).json({ error: "Faltan campos obligatorios." });
    }

    // Existencia: usuario y categoría
    const user = db
      .prepare("SELECT id FROM usuarios WHERE id = ?")
      .get(usuario_id);
    if (!user) return res.status(400).json({ error: "Usuario inválido." });

    const cat = db
      .prepare("SELECT id FROM categorias WHERE id = ?")
      .get(categoria_id);
    if (!cat) return res.status(400).json({ error: "Categoría inválida." });

    // Validar subcategorías: que existan y pertenezcan a la categoría indicada
    const checkSub = db.prepare(
      "SELECT id, tipo FROM subcategorias WHERE id = ? AND categoria_id = ?",
    );
    if (subcategoria1_id) {
      const s1 = checkSub.get(subcategoria1_id, categoria_id);
      if (!s1)
        return res
          .status(400)
          .json({ error: "subcategoria1 inválida para la categoría." });
    }
    if (subcategoria2_id) {
      const s2 = checkSub.get(subcategoria2_id, categoria_id);
      if (!s2)
        return res
          .status(400)
          .json({ error: "subcategoria2 inválida para la categoría." });
    }

    // No permitir la misma subcategoria en ambos campos
    if (
      subcategoria1_id &&
      subcategoria2_id &&
      subcategoria1_id === subcategoria2_id
    ) {
      return res.status(400).json({
        error: "No se puede seleccionar la misma subcategoría dos veces.",
      });
    }

    // Insertar publicacion en tabla
    const insert = db.prepare(`INSERT INTO publicaciones
      (usuario_id, categoria_id, subcategoria1_id, subcategoria2_id, titulo, descripcion, precio, cantidad, imagen)
      VALUES (@usuario_id, @categoria_id, @subcategoria1_id, @subcategoria2_id, @titulo, @descripcion, @precio, @cantidad, @imagen)`);

    const insertTransaction = db.transaction((pub) => {
      const info = insert.run(pub);
      return info.lastInsertRowid;
    });

    const lastId = insertTransaction({
      usuario_id,
      categoria_id,
      subcategoria1_id,
      subcategoria2_id,
      titulo,
      descripcion,
      precio,
      cantidad,
      imagen,
    });

    res.status(201).json({ success: true, id: lastId });
  } catch (err) {
    console.error("Error /api/publicaciones POST:", err);
    res.status(500).json({ error: "Error al crear publicación" });
  }
});

export default router;
