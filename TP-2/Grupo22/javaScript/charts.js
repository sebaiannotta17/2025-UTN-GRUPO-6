document.addEventListener("DOMContentLoaded", () => {
    const visualizarDatosBtn = document.getElementById("visualizarDatosBtn");
    const contenedor = document.querySelector(".contenidoApi");
    const STRAPI_URL = "https://gestionweb.frlp.utn.edu.ar/api/g22-peliculas";
    const STRAPI_TOKEN = "099da4cc6cbb36bf7af8de6f1f241f8c81e49fce15709c4cfcae1313090fa2c1ac8703b0179863b4eb2739ea65ae435e90999adb870d49f9f94dcadd88999763119edca01a6b34c25be92a80ed30db1bcacb20df40e4e7f45542bd501f059201ad578c18a11e4f5cd592cb25d6c31a054409caa99f11b6d2391440e9c72611ea"; // Usa tu token real

    visualizarDatosBtn.addEventListener("click", async () => {
        contenedor.innerHTML = "<p>Cargando datos para visualización</p>";

        try {
            // 1. Obtener datos
            const response = await fetch(STRAPI_URL, {
                headers: {
                    "Authorization": `Bearer ${STRAPI_TOKEN}`,
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) throw new Error(`Error ${response.status}`);
            const result = await response.json();
            console.log("Datos recibidos:", result);

            // 2. Procesar datos y eliminar duplicados
            const peliculasUnicas = [];
            const registrosVistos = new Set();

            result.data.forEach(item => {
                const attrs = item.attributes || item;
                const claveUnica = `${attrs.titulo}_${attrs.anio}`;
                
                if (!registrosVistos.has(claveUnica)) {
                    registrosVistos.add(claveUnica);
                    peliculasUnicas.push({
                        titulo: attrs.titulo || "Sin título",
                        popularidad: attrs.popularidad || 0,
                        anio: attrs.anio || "N/A"
                    });
                }
            });

            // 3. Ordenar por popularidad
            peliculasUnicas.sort((a, b) => b.popularidad - a.popularidad);

            // 4. Crear gráfico
            contenedor.innerHTML = `
                <h2>Estadisticas de Películas por Popularidad</h2>
                <div class="chart-container">
                    <canvas id="graficoPopularidad"></canvas>
                </div>
            `;

            const ctx = document.getElementById('graficoPopularidad').getContext('2d');
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: peliculasUnicas.map(p => `${p.titulo} (${p.anio})`),
                    datasets: [{
                        label: 'Popularidad',
                        data: peliculasUnicas.map(p => p.popularidad),
                        backgroundColor: peliculasUnicas.map((_, i) => 
                            `hsl(${(i * 360 / peliculasUnicas.length)}, 70%, 60%)`),
                        borderColor: peliculasUnicas.map((_, i) => 
                            `hsl(${(i * 360 / peliculasUnicas.length)}, 70%, 40%)`),
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            callbacks: {
                                label: ctx => `Popularidad: ${ctx.raw}`
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: { display: true, text: 'Popularidad' }
                        },
                        x: {
                            ticks: {
                                autoSkip: false,
                                maxRotation: 45,
                                minRotation: 45
                            }
                        }
                    }
                }
            });

        } catch (error) {
            console.error("Error:", error);
            contenedor.innerHTML = `
                <div class="error-box">
                    <h3>Error al procesar datos</h3>
                    <p>${error.message}</p>
                </div>
            `;
        }
    });
});