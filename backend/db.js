import path from "node:path";
import { fileURLToPath } from "node:url";
import Database from "better-sqlite3";

// __dirname para ES Modules
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Ruta correcta: backend/database/materiales.db
const dbPath = path.join(__dirname, "database", "materiales.db");
console.log("🗃️ Abriendo SQLite en:", dbPath);

const db = new Database(dbPath, {
  verbose: console.log, // opcional: loguea las queries
});

export default db;
