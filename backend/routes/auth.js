// routes/auth.js
import express from "express";
const router = express.Router();

// Login de prueba: SOLO acepta estas credenciales
const OK_EMAIL = "user@test.com";
const OK_PASS  = "1234";

router.post("/login", (req, res) => {
  const { email, password } = req.body || {};
  if (email === OK_EMAIL && password === OK_PASS) {
    return res.json({
      token: "mock.jwt.token",
      user: { id: 1, email: OK_EMAIL, name: "Usuario Test" },
    });
  }
  // Credenciales incorrectas -> 401 con mensaje claro (CA2)
  return res.status(401).json({ message: "Usuario o contraseña incorrectos." });
});

export default router;
