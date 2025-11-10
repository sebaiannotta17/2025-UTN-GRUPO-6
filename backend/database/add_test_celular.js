import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'materiales.db');
const db = new Database(dbPath);

try {
  console.log('Actualizando algunos usuarios con números de celular para pruebas...');
  
  // Actualizar usuario con ID 1
  const update1 = db.prepare("UPDATE usuarios SET celular = ? WHERE id = ?");
  update1.run("+54 9 11 1234-5678", 1);
  
  // Si existe usuario con ID 2
  const user2 = db.prepare("SELECT * FROM usuarios WHERE id = ?").get(2);
  if (user2) {
    update1.run("+54 9 11 8765-4321", 2);
  }
  
  // Mostrar usuarios actualizados
  console.log('\n📱 Usuarios con celular:');
  const users = db.prepare("SELECT id, nombre, email, celular FROM usuarios WHERE celular IS NOT NULL").all();
  
  users.forEach(user => {
    console.log(`- ${user.nombre} (${user.email}): ${user.celular}`);
  });
  
  console.log('\n✅ Datos de prueba agregados');

} catch (error) {
  console.error('Error agregando datos de prueba:', error);
} finally {
  db.close();
  console.log('\nBase de datos cerrada');
}