import db from "../db.js";

console.log("=== PROBANDO INSERTAR FAVORITO MANUALMENTE ===\n");

try {
    // Insertar: Usuario 7 (seba) marca como favorita la publicación 1 del usuario 1 (prueba)
    const insertFavorito = db.prepare("INSERT INTO favoritos (usuario_id, publicacion_id) VALUES (?, ?)");
    const resultado = insertFavorito.run(7, 1);
    
    console.log("✅ Favorito insertado exitosamente!");
    console.log(`   ID del favorito: ${resultado.lastInsertRowid}`);
    console.log(`   Filas afectadas: ${resultado.changes}`);
    
    // Verificar que se insertó
    console.log("\n🔍 Verificando inserción:");
    const favoritos = db.prepare("SELECT * FROM favoritos").all();
    favoritos.forEach(f => {
        console.log(`   ⭐ Usuario ${f.usuario_id} marcó como favorita la publicación ${f.publicacion_id} el ${f.fecha_agregado}`);
    });
    
} catch (error) {
    console.log("❌ Error insertando favorito:", error.message);
    
    // Si ya existe, intentemos consultarlo
    if (error.message.includes('UNIQUE')) {
        console.log("\n🔍 El favorito ya existe, consultando favoritos actuales:");
        const favoritos = db.prepare("SELECT * FROM favoritos").all();
        favoritos.forEach(f => {
            console.log(`   ⭐ Usuario ${f.usuario_id} marcó como favorita la publicación ${f.publicacion_id}`);
        });
    }
}

db.close();
console.log("\n✅ Prueba terminada");