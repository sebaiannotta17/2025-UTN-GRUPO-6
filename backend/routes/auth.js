import express from "express";
const router = express.Router();

const OK_EMAIL = "user@test.com";
const OK_PASS = "1234";

router.post("/login", (req, res) => {
  const { email, password } = req.body || {};
  if (email === OK_EMAIL && password === OK_PASS) {
    return res.json({
      token: "mock.jwt.token",
      user: { id: 1, email: OK_EMAIL, name: "Usuario Test" },
    });
  }
  return res.status(401).json({ message: "Usuario o contraseña incorrectos." });
});



const users = [
  { id: 1, name: "seba", email: "seba@test.com" },
  { id: 2, name: "maria", email: "maria@test.com" },
];


const findByName  = (n) => users.find(u => (u.name || "").toLowerCase() === n.toLowerCase());
const findByEmail = (e) => users.find(u => (u.email || "").toLowerCase() === e.toLowerCase());

// Ruta /register
router.post("/register", (req, res) => {
  const { name, email, password } = req.body || {};

  
  if (!name || !email || !password) {
    return res.status(400).json({ error: "Completá todos los campos." });
  }

  
  if (findByName(name)) {
    return res.status(409).json({ error: "Usuario ya registrado." });
  }


  if (findByEmail(email)) {
    return res.status(409).json({ error: "Ese email ya está en uso." });
  }

  const newUser = { id: Date.now(), name, email };
  users.push(newUser);

  const token = "local." + Buffer.from(email).toString("base64") + ".token";
  res.status(201).json({ user: newUser, token });
});

export default router;
