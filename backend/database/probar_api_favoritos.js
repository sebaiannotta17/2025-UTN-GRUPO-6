// Probar las rutas de favoritos con fetch
// Ejecutar esto desde la consola del navegador o con node con fetch

console.log("=== PROBANDO RUTAS DE LA API ===\n");

const API_BASE = "http://localhost:3000/api";

async function probarRutasFavoritos() {
    
    console.log("1️⃣ Probando GET /favoritos/7 (obtener favoritos del usuario seba):");
    try {
        const response1 = await fetch(`${API_BASE}/favoritos/7`);
        const data1 = await response1.json();
        console.log("   Status:", response1.status);
        console.log("   Data:", data1);
    } catch (error) {
        console.log("   ❌ Error:", error.message);
    }
    
    console.log("\n2️⃣ Probando GET /favoritos/check/7/2 (verificar si usuario 7 tiene favorita la pub 2):");
    try {
        const response2 = await fetch(`${API_BASE}/favoritos/check/7/2`);
        const data2 = await response2.json();
        console.log("   Status:", response2.status);
        console.log("   Data:", data2);
    } catch (error) {
        console.log("   ❌ Error:", error.message);
    }
    
    console.log("\n3️⃣ Probando POST /favoritos (agregar favorito usuario 7, pub 2):");
    try {
        const response3 = await fetch(`${API_BASE}/favoritos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuario_id: 7, publicacion_id: 2 })
        });
        const data3 = await response3.json();
        console.log("   Status:", response3.status);
        console.log("   Data:", data3);
    } catch (error) {
        console.log("   ❌ Error:", error.message);
    }
    
    console.log("\n4️⃣ Verificando nuevamente GET /favoritos/7:");
    try {
        const response4 = await fetch(`${API_BASE}/favoritos/7`);
        const data4 = await response4.json();
        console.log("   Status:", response4.status);
        console.log("   Cantidad de favoritos:", data4.length);
        data4.forEach((fav, i) => {
            console.log(`   Favorito ${i+1}: ${fav.titulo} (ID: ${fav.id})`);
        });
    } catch (error) {
        console.log("   ❌ Error:", error.message);
    }
}

// Si estás ejecutando esto en Node.js, descomenta la siguiente línea:
// probarRutasFavoritos();

// Si estás en el navegador, copia y pega la función probarRutasFavoritos() en la consola