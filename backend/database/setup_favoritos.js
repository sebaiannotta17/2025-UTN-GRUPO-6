import db from "../db.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Leer y ejecutar el SQL
const sqlPath = path.join(__dirname, "crear_tabla_favoritos.sql");
const sql = fs.readFileSync(sqlPath, "utf8");

try {
    db.exec(sql);
    console.log("✅ Tabla favoritos creada exitosamente!");
} catch (error) {
    console.error("❌ Error creando tabla favoritos:", error);
}

db.close();