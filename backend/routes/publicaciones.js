import express from "express";
import db from "../db.js";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();

// Setup multer storage to save uploads into frontend/imgs
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const IMAGES_DIR = path.join(__dirname, "..", "..", "frontend", "imgs");
if (!fs.existsSync(IMAGES_DIR)) fs.mkdirSync(IMAGES_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, IMAGES_DIR),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.random().toString(36).slice(2, 8);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, unique + ext);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype && file.mimetype.startsWith("image/")) cb(null, true);
  else cb(new Error("Tipo de archivo no permitido. Sólo imágenes."), false);
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

/**
 * GET /api/publicaciones
 * Lista publicaciones (opcionalmente filtradas por usuario_id)
 * Devuelve campos útiles para listar y editar (incluye IDs y nombres).
 */
router.get("/", (req, res) => {
  const { usuario_id } = req.query;

  let sql = `
    SELECT
      p.id,
      p.usuario_id,
      p.titulo,
      p.descripcion,
      p.precio,
      p.cantidad,
      p.imagen,
      p.fecha_publicacion,
      p.categoria_id,
      p.subcategoria1_id,
      p.subcategoria2_id,
      c.nombre  AS categoria_nombre,
      s1.nombre AS subcategoria1_nombre,
      s2.nombre AS subcategoria2_nombre
    FROM publicaciones p
    JOIN categorias c      ON p.categoria_id = c.id
    LEFT JOIN subcategorias s1 ON p.subcategoria1_id = s1.id
    LEFT JOIN subcategorias s2 ON p.subcategoria2_id = s2.id
  `;
  const params = [];

  if (usuario_id) {
    if (isNaN(parseInt(usuario_id))) {
      return res.status(400).json({ error: "ID de usuario inválido." });
    }
    sql += ` WHERE p.usuario_id = ?`;
    params.push(usuario_id);
  }

  sql += ` ORDER BY p.fecha_publicacion DESC`;

  try {
    const statement = db.prepare(sql);
    const publicaciones = statement.all(params);
    return res.status(200).json(publicaciones); // devuelve [] si no hay
  } catch (err) {
    console.error("Error /api/publicaciones GET:", err);
    return res.status(500).json({ error: "Error al obtener publicaciones" });
  }
});

router.get("/recientes", (req, res) => {
  const limit = Math.min(parseInt(req.query.limit) || 8, 50);
  const usuarioId = parseInt(req.query.usuario_id || "");

  try {
    let sql = `
      SELECT
        p.id,
        p.usuario_id,
        p.titulo,
        p.descripcion,
        p.precio,
        p.cantidad,
        p.imagen,
        p.fecha_publicacion,
        u.nombre  AS vendedor_nombre,
        p.categoria_id,
        p.subcategoria1_id,
        p.subcategoria2_id,
        c.nombre  AS categoria_nombre,
        s1.nombre AS subcategoria1_nombre,
        s2.nombre AS subcategoria2_nombre
      FROM publicaciones p
      JOIN usuarios u           ON u.id = p.usuario_id
      JOIN categorias c         ON p.categoria_id = c.id
      LEFT JOIN subcategorias s1 ON p.subcategoria1_id = s1.id
      LEFT JOIN subcategorias s2 ON p.subcategoria2_id = s2.id
    `;

    const params = [];
    if (!isNaN(usuarioId)) {
      sql += ` WHERE p.usuario_id = ? `;
      params.push(usuarioId);
    }

    sql += ` ORDER BY p.fecha_publicacion DESC LIMIT ?`;
    params.push(limit);

    const stmt = db.prepare(sql);
    const list = stmt.all(...params);
    return res.json(list);
  } catch (err) {
    console.error("Error /api/publicaciones/recientes:", err);
    return res.status(500).json({ error: "No se pudieron obtener recientes" });
  }
});


/**
 * GET /api/publicaciones/:id
 * Detalle de la publicación + datos del vendedor
 */
router.get("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "ID inválido" });

  try {
    const stmt = db.prepare(`
      SELECT
        p.id,
        p.usuario_id,
        p.categoria_id,
        p.subcategoria1_id,
        p.subcategoria2_id,
        p.titulo,
        p.descripcion,
        p.precio,
        p.cantidad,
        p.imagen,
        p.fecha_publicacion,
        u.nombre  AS vendedor_nombre,
        u.email   AS vendedor_email,
        c.nombre  AS categoria_nombre,
        s1.nombre AS subcategoria1_nombre,
        s2.nombre AS subcategoria2_nombre
      FROM publicaciones p
      JOIN usuarios u       ON u.id = p.usuario_id
      JOIN categorias c     ON c.id = p.categoria_id
      LEFT JOIN subcategorias s1 ON s1.id = p.subcategoria1_id
      LEFT JOIN subcategorias s2 ON s2.id = p.subcategoria2_id
      WHERE p.id = ?
    `);

    const pub = stmt.get(id);
    if (!pub) return res.status(404).json({ error: "No existe la publicación" });

    return res.json(pub);
  } catch (e) {
    console.error("Error /api/publicaciones/:id:", e);
    return res.status(500).json({ error: "Error al obtener la publicación" });
  }
});

/**
 * POST /api/publicaciones
 * Crear publicación con validaciones
 */
// Accept multipart/form-data with optional file field 'imagen'
router.post("/", upload.single("imagen"), (req, res) => {
  try {
  // Debugging: log incoming request details to help trace client errors
  console.log('[POST /api/publicaciones] content-type:', req.headers && req.headers['content-type']);
  console.log('[POST /api/publicaciones] file present:', !!req.file);
  // req.body may be an Object with null prototype when parsed by multer
  console.log('[POST /api/publicaciones] body keys:', req.body && Object.keys(req.body));
    // body fields come as strings when multipart
    const usuario_id = parseInt(req.body.usuario_id);
    const categoria_id = parseInt(req.body.categoria_id);
    const subcategoria1_id = req.body.subcategoria1_id
      ? parseInt(req.body.subcategoria1_id)
      : null;
    const subcategoria2_id = req.body.subcategoria2_id
      ? parseInt(req.body.subcategoria2_id)
      : null;
    const titulo = (req.body.titulo || req.body.nombre || "").trim();
    const descripcion = (req.body.descripcion || "").trim();
    const precio = parseFloat(req.body.precio);
    const cantidad = parseInt(req.body.cantidad);

    // imagen path if file was uploaded
    const imagen = req.file ? `/imgs/${req.file.filename}` : req.body.imagen || null;

    if (!usuario_id || !categoria_id || !titulo || !descripcion || !precio || !cantidad) {
      return res.status(400).json({ error: "Faltan campos obligatorios." });
    }

    const user = db.prepare("SELECT id FROM usuarios WHERE id = ?").get(usuario_id);
    if (!user) return res.status(400).json({ error: "Usuario inválido." });

    const cat = db.prepare("SELECT id FROM categorias WHERE id = ?").get(categoria_id);
    if (!cat) return res.status(400).json({ error: "Categoría inválida." });

    const checkSub = db.prepare(
      "SELECT id FROM subcategorias WHERE id = ? AND categoria_id = ?"
    );
    if (subcategoria1_id) {
      const s1 = checkSub.get(subcategoria1_id, categoria_id);
      if (!s1) return res.status(400).json({ error: "subcategoria1 inválida para la categoría." });
    }
    if (subcategoria2_id) {
      const s2 = checkSub.get(subcategoria2_id, categoria_id);
      if (!s2) return res.status(400).json({ error: "subcategoria2 inválida para la categoría." });
    }

    if (subcategoria1_id && subcategoria2_id && subcategoria1_id === subcategoria2_id) {
      return res.status(400).json({
        error: "No se puede seleccionar la misma subcategoría dos veces.",
      });
    }

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

    return res.status(201).json({ success: true, id: lastId });
  } catch (err) {
    console.error("Error /api/publicaciones POST:", err);
    return res.status(500).json({ error: "Error al crear publicación" });
  }
});

/**
 * PUT /api/publicaciones/:id
 * Actualizar una publicación existente
 */
// Accept multipart/form-data with optional 'imagen' file
router.put("/:id", (req, res) => {
  // Invoke multer parser only for requests that are multipart; this wrapper allows
  // the route to accept either application/json (from clients that don't send a file)
  // or multipart/form-data (when an image is uploaded).
  upload.single("imagen")(req, res, () => {
    const { id } = req.params;
    try {
      console.log(`[PUT ${id}] incoming headers:`, req.headers && req.headers['content-type']);
      console.log(`[PUT ${id}] multer file present:`, !!req.file);

      // parse incoming values (support both multipart and JSON bodies)
      const categoria_id = req.body && req.body.categoria_id ? parseInt(req.body.categoria_id) : null;
      const subcategoria1_id = req.body && req.body.subcategoria1_id ? parseInt(req.body.subcategoria1_id) : null;
      const subcategoria2_id = req.body && req.body.subcategoria2_id ? parseInt(req.body.subcategoria2_id) : null;
      const titulo = (req.body && (req.body.titulo || req.body.nombre) || "").toString().trim();
      const descripcion = (req.body && req.body.descripcion || "").toString().trim();
      const precio = req.body && req.body.precio ? parseFloat(req.body.precio) : null;
      const cantidad = req.body && req.body.cantidad ? parseInt(req.body.cantidad) : null;

      console.log("[PUT body raw]:", req.body);

      if (!titulo || !descripcion || precio === null || cantidad === null) {
        return res.status(400).json({ error: "Faltan campos obligatorios." });
      }

      const pubExist = db.prepare("SELECT * FROM publicaciones WHERE id = ?").get(id);
      if (!pubExist) {
        return res.status(404).json({ error: "Publicación no encontrada." });
      }

      // Determine new imagen value: if file uploaded, use it; else if imagen provided in body use it; otherwise keep existing
      let imagen = pubExist.imagen;
      if (req.file) {
        imagen = `/imgs/${req.file.filename}`;
        // remove old image file if it was stored locally under /imgs
        try {
          if (pubExist.imagen && pubExist.imagen.startsWith("/imgs/")) {
            const oldFilename = path.basename(pubExist.imagen);
            const oldPath = path.join(IMAGES_DIR, oldFilename);
            if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
          }
        } catch (e) {
          console.warn("No se pudo borrar imagen anterior:", e.message || e);
        }
      } else if (typeof req.body.imagen !== "undefined") {
        // explicit imagen field in body (could be null or a URL)
        imagen = req.body.imagen || null;
      }

      console.log("[PUT publicaciones] valores:", { id, categoria_id, subcategoria1_id, subcategoria2_id, titulo, descripcion, precio, cantidad, imagen });

      const update = db.prepare(`
        UPDATE publicaciones SET
          categoria_id = @categoria_id,
          subcategoria1_id = @subcategoria1_id,
          subcategoria2_id = @subcategoria2_id,
          titulo = @titulo,
          descripcion = @descripcion,
          precio = @precio,
          cantidad = @cantidad,
          imagen = @imagen
        WHERE id = @id
      `);

      const info = update.run({
        id,
        categoria_id,
        subcategoria1_id,
        subcategoria2_id,
        titulo,
        descripcion,
        precio,
        cantidad,
        imagen,
      });

      if (info.changes === 0) {
        return res.status(500).json({ error: "No se pudo actualizar la publicación." });
      }

      return res.status(200).json({ success: true, message: "Publicación actualizada." });
    } catch (err) {
      console.error(`Error /api/publicaciones/${id} PUT:`, err);
      if (err && err.stack) console.error(err.stack);
      return res.status(500).json({ error: "Error interno al actualizar." });
    }
  });
});

/**
 * DELETE /api/publicaciones/:id
 * Eliminar una publicación
 */
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  try {
    const pubExist = db.prepare("SELECT * FROM publicaciones WHERE id = ?").get(id);
    if (!pubExist) {
      return res.status(404).json({ error: "Publicación no encontrada." });
    }

    // If image stored locally, remove file
    try {
      if (pubExist.imagen && pubExist.imagen.startsWith("/imgs/")) {
        const oldFilename = path.basename(pubExist.imagen);
        const oldPath = path.join(IMAGES_DIR, oldFilename);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
    } catch (e) {
      console.warn("No se pudo borrar imagen asociada al eliminar:", e.message || e);
    }

    const del = db.prepare("DELETE FROM publicaciones WHERE id = ?");
    const info = del.run(id);

    if (info.changes === 0) {
      return res.status(500).json({ error: "No se pudo eliminar la publicación." });
    }

    return res.status(200).json({ success: true, message: "Publicación eliminada." });
  } catch (err) {
    console.error(`Error /api/publicaciones/${id} DELETE:`, err);
    return res.status(500).json({ error: "Error interno al eliminar." });
  }
});

export default router;

