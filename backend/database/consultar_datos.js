import db from "../db.js";

console.log("=== REVISANDO DATOS EXISTENTES ===\n");

// Ver usuarios
console.log("📋 USUARIOS:");
try {
    const usuarios = db.prepare("SELECT id, nombre, email FROM usuarios").all();
    if (usuarios.length === 0) {
        console.log("   ❌ No hay usuarios registrados");
    } else {
        usuarios.forEach(u => {
            console.log(`   👤 ID: ${u.id} | Nombre: ${u.nombre} | Email: ${u.email}`);
        });
    }
} catch (error) {
    console.log("   ❌ Error consultando usuarios:", error.message);
}

console.log("\n📦 PUBLICACIONES:");
try {
    const publicaciones = db.prepare("SELECT id, titulo, usuario_id FROM publicaciones LIMIT 5").all();
    if (publicaciones.length === 0) {
        console.log("   ❌ No hay publicaciones");
    } else {
        publicaciones.forEach(p => {
            console.log(`   📝 ID: ${p.id} | Título: ${p.titulo} | Usuario: ${p.usuario_id}`);
        });
        if (publicaciones.length === 5) {
            console.log("   ... (mostrando solo las primeras 5)");
        }
    }
} catch (error) {
    console.log("   ❌ Error consultando publicaciones:", error.message);
}

console.log("\n❤️ FAVORITOS ACTUALES:");
try {
    const favoritos = db.prepare("SELECT * FROM favoritos").all();
    if (favoritos.length === 0) {
        console.log("   📭 No hay favoritos aún");
    } else {
        favoritos.forEach(f => {
            console.log(`   ⭐ Usuario ${f.usuario_id} marcó como favorita la publicación ${f.publicacion_id}`);
        });
    }
} catch (error) {
    console.log("   ❌ Error consultando favoritos:", error.message);
}

db.close();
console.log("\n✅ Consulta terminada");