import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const MOCK = [
  { id: 1,  name: "Cemento Portland",       desc: "Bolsa 50kg",  price: 9500 },
  { id: 2,  name: "Arena fina",             desc: "m³",          price: 18000 },
  { id: 3,  name: "Hierro 8mm",             desc: "Barra 12m",   price: 11000 },
  // ...pegá acá el resto de tu lista...
];

app.get("/api/materials", (req, res) => {
  const q = (req.query.text || "").toLowerCase().trim();
  const items = !q
    ? MOCK
    : MOCK.filter(m => (`${m.name} ${m.desc ?? ""}`).toLowerCase().includes(q));
  res.json(items);
});

app.listen(3000, () => console.log("API ON http://localhost:3000"));
