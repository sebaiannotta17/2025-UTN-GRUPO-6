import express from 'express';
import db from '../db.js';

const router = express.Router();

// Obtener información del vendedor por ID de publicación
router.get('/:publicacionId', (req, res) => {
  const { publicacionId } = req.params;

  try {
    const stmt = db.prepare(`
      SELECT 
        u.id,
        u.nombre,
        u.email,
        u.celular,
        u.fecha_registro,
        COUNT(p.id) as total_publicaciones
      FROM usuarios u
      INNER JOIN publicaciones pub ON u.id = pub.usuario_id
      LEFT JOIN publicaciones p ON u.id = p.usuario_id
      WHERE pub.id = ?
      GROUP BY u.id, u.nombre, u.email, u.celular, u.fecha_registro
    `);
    
    const vendedor = stmt.get(publicacionId);

    if (!vendedor) {
      return res.status(404).json({ error: 'Vendedor no encontrado' });
    }

    // No devolver información sensible
    const vendedorInfo = {
      id: vendedor.id,
      nombre: vendedor.nombre,
      email: vendedor.email,
      celular: vendedor.celular,
      fecha_registro: vendedor.fecha_registro,
      total_publicaciones: vendedor.total_publicaciones
    };

    res.json(vendedorInfo);

  } catch (error) {
    console.error('Error obteniendo vendedor:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Obtener información del vendedor por ID de usuario
router.get('/usuario/:usuarioId', (req, res) => {
  const { usuarioId } = req.params;

  try {
    const stmt = db.prepare(`
      SELECT 
        u.id,
        u.nombre,
        u.email,
        u.celular,
        u.fecha_registro,
        COUNT(p.id) as total_publicaciones
      FROM usuarios u
      LEFT JOIN publicaciones p ON u.id = p.usuario_id
      WHERE u.id = ?
      GROUP BY u.id, u.nombre, u.email, u.celular, u.fecha_registro
    `);
    
    const vendedor = stmt.get(usuarioId);

    if (!vendedor) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // No devolver información sensible
    const vendedorInfo = {
      id: vendedor.id,
      nombre: vendedor.nombre,
      email: vendedor.email,
      celular: vendedor.celular,
      fecha_registro: vendedor.fecha_registro,
      total_publicaciones: vendedor.total_publicaciones
    };

    res.json(vendedorInfo);

  } catch (error) {
    console.error('Error obteniendo usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;