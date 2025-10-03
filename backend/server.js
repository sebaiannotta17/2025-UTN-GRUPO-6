// server.js
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// sirve /public como sitio
app.use(express.static(path.join(__dirname, "public")));

// --- tu API existente ---
const MOCK = [
  { id: 1,  name: "Cemento Portland", desc: "Bolsa 50kg", price: 9500 },
  { id: 2,  name: "Arena fina",       desc: "m³",        price: 18000 },
  { id: 3,  name: "Hierro 8mm",       desc: "Barra 12m", price: 11000 },
  // ...
];

app.get("/api/materials", (req, res) => {
  const q = (req.query.text || "").toLowerCase().trim();
  const items = !q ? MOCK
    : MOCK.filter(m => (`${m.name} ${m.desc ?? ""}`).toLowerCase().includes(q));
  res.json(items);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API ON http://localhost:${PORT}`));
