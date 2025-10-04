import Database from "better-sqlite3";

// Conexión a la base de datos
const db = new Database("./backend/database/materiales.db", {
  verbose: console.log,
});

// Exportar la conexión (ESM usa "export default")
export default db;
