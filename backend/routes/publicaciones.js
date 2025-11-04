import express from "express";
import db from "../db.js";

const router = express.Router();

router.get("/", (req, res) => {
  // Extraer el parámetro de filtro (opcional)
  const { usuario_id } = req.query;

  let sql = `
        SELECT
            p.id,
            p.titulo,
            p.descripcion,
            p.precio,
            p.cantidad,
            p.imagen,
            p.fecha_publicacion,
            c.nombre AS categoria_nombre,
            s1.nombre AS subcategoria1_nombre,
            s2.nombre AS subcategoria2_nombre
        FROM publicaciones p
        JOIN categorias c ON p.categoria_id = c.id
        LEFT JOIN subcategorias s1 ON p.subcategoria1_id = s1.id
        LEFT JOIN subcategorias s2 ON p.subcategoria2_id = s2.id
    `;
  const params = [];

  // Aplicar filtro si se proporciona usuario_id
  if (usuario_id) {
    // Validación básica
    if (isNaN(parseInt(usuario_id))) {
      return res.status(400).json({ error: "ID de usuario inválido." });
    }
    sql += ` WHERE p.usuario_id = ?`;
    params.push(usuario_id);
  }

  // Opcional: ordenar por fecha de creación descendente
  sql += ` ORDER BY p.fecha_publicacion DESC`;

  try {
    const statement = db.prepare(sql);
    const publicaciones = statement.all(params);

    // Si no se encuentra nada, devuelve un array vacío (o un 404 si es estricto)
    if (publicaciones.length === 0 && usuario_id) {
      // No es un error, simplemente no hay publicaciones para ese usuario
      return res.status(200).json([]);
    }

    res.status(200).json(publicaciones);
  } catch (err) {
    console.error("Error /api/publicaciones GET:", err);
    res.status(500).json({ error: "Error al obtener publicaciones" });
  }
});

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
