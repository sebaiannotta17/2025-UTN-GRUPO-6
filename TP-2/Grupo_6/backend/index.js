const express = require("express");
const app = express();
const port = 81;

app.get("/", (req, res) => {
  res.send("¡Hola jejee!");
});

app.listen(port, () => {
  console.log(` Servidor backend escuchando en puerto ${port}`);
});