import Database from "better-sqlite3"; // 1. Cambiar require por import

const db = new Database("backend/database/materiales.db");

// 2. Exportación por defecto
export default db;
