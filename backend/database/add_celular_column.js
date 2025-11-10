import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'materiales.db');
const db = new Database(dbPath);

try {
  console.log('Agregando columna celular a la tabla usuarios...');
  
  // Verificar si la columna ya existe
  const tableInfo = db.prepare("PRAGMA table_info(usuarios)").all();
  const celularExists = tableInfo.some(column => column.name === 'celular');
  
  if (celularExists) {
    console.log('La columna celular ya existe en la tabla usuarios');
  } else {
    // Agregar la columna celular
    db.exec('ALTER TABLE usuarios ADD COLUMN celular TEXT');
    console.log('✅ Columna celular agregada exitosamente');
  }
  
  // Mostrar estructura actualizada
  console.log('\nEstructura actual de la tabla usuarios:');
  const updatedInfo = db.prepare("PRAGMA table_info(usuarios)").all();
  updatedInfo.forEach(column => {
    console.log(`- ${column.name}: ${column.type}${column.notnull ? ' NOT NULL' : ''}${column.pk ? ' PRIMARY KEY' : ''}`);
  });
  
} catch (error) {
  console.error('Error agregando columna celular:', error);
} finally {
  db.close();
  console.log('\nBase de datos cerrada');
}