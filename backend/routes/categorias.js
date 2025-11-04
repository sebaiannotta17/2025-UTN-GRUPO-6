import express from "express";
import db from "../db.js";

const router = express.Router();

// Obtener todas las categorias
router.get("/", (req, res) => {
  const categorias = db.prepare("SELECT * FROM categorias").all();
  const subcategorias = db.prepare("SELECT * FROM subcategorias").all();

  const categoriasConSubs = categorias.map((cat) => ({
    ...cat,
    subcategorias: subcategorias.filter((sub) => sub.categoria_id === cat.id),
  }));

  res.json(categoriasConSubs);
});

// Obtener las subcategorias de la categoria elegida
router.get("/:id/subcategorias", (req, res) => {
  const { id } = req.params;
  const subs = db
    .prepare("SELECT * FROM subcategorias WHERE categoria_id = ?")
    .all(id);
  res.json(subs);
});

export default router;
