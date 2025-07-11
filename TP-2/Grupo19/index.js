document.addEventListener('DOMContentLoaded', function() {
    // Configuración
    const TMDB_API_KEY = '4679b48589a822d0ac3a57cb28c3ab7d';
    const STRAPI_API_URL = 'https://gestionweb.frlp.utn.edu.ar/api';
    const STRAPI_TOKEN = '099da4cc6cbb36bf7af8de6f1f241f8c81e49fce15709c4cfcae1313090fa2c1ac8703b0179863b4eb2739ea65ae435e90999adb870d49f9f94dcadd88999763119edca01a6b34c25be92a80ed30db1bcacb20df40e4e7f45542bd501f059201ad578c18a11e4f5cd592cb25d6c31a054409caa99f11b6d2391440e9c72611ea';
    const COMPANY_ID = 25; // 20th Century Fox
    
    // Endpoints
    const PELICULAS_ENDPOINT = '/g19-peliculas';
    
    // Elementos del DOM
    const btnCargar = document.getElementById('cargarDatos');
    const btnVisualizar = document.getElementById('visualizarDatos');
    const contenido = document.getElementById('contenido');
    
    // 1. Botón para cargar datos desde TMDB a Strapi
    btnCargar.addEventListener('click', async function() {
    try {
        contenido.innerHTML = '<p class="estilo3">Cargando datos desde TMDB...</p>';
        
        // 1. Obtener películas existentes
        const existentes = await fetch(`${STRAPI_API_URL}${PELICULAS_ENDPOINT}?fields[0]=titulo`, {
            headers: { 'Authorization': `Bearer ${STRAPI_TOKEN}` }
        }).then(res => res.json());
        
        const titulosExistentes = new Set(existentes.data?.map(p => p.attributes?.titulo || p.titulo) || []);
        
        // 2. Obtener películas de TMDB
        const tmdbResponse = await fetch(
            `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_companies=${COMPANY_ID}&sort_by=popularity.desc&page=1`
        );
        const tmdbData = await tmdbResponse.json();
        
        // 3. Filtrar solo películas nuevas
        const nuevasPeliculas = tmdbData.results.slice(0, 10).filter(movie => 
            !titulosExistentes.has(movie.title)
        );
        
        // 4. Guardar solo las nuevas
        let guardadas = 0;
        for (const movie of nuevasPeliculas) {
            const generosTexto = movie.genre_ids.map(id => genreMap[id]).join(', ');
            
            await fetch(`${STRAPI_API_URL}${PELICULAS_ENDPOINT}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${STRAPI_TOKEN}`
                },
                body: JSON.stringify({
                    data: {
                        titulo: movie.title,
                        fecha_estreno: movie.release_date,
                        votos_totales: movie.vote_count,
                        promedio_votos: movie.vote_average,
                        generos: generosTexto
                    }
                })
            });
            guardadas++;
        }
        
        // Mostrar resultados
        contenido.innerHTML = `
            <p class="estilo1">${guardadas > 0 ? '¡Datos cargados!' : 'No se añadieron películas nuevas, Ya existen.'}</p>
            <p>Películas nuevas guardadas: ${guardadas}</p>
            ${guardadas > 0 ? `
                <h4>Películas añadidas:</h4>
                <ul>
                    ${nuevasPeliculas.map(m => `<li>${m.title}</li>`).join('')}
                </ul>
            ` : ''}
        `;
        
    } catch (error) {
        contenido.innerHTML = `
            <p class="estilo2">Error al cargar datos</p>
            <p>${error.message}</p>
        `;
    }
});
    
    // 2. Botón para visualizar datos desde Strapi
    // 2. Botón para visualizar datos desde Strapi
btnVisualizar.addEventListener('click', async function() {
    try {
        contenido.innerHTML = '<p class="estilo3">Cargando datos desde Strapi...</p>';
        
        const response = await fetch(
            `${STRAPI_API_URL}${PELICULAS_ENDPOINT}?sort=fecha_estreno:desc`,
            { headers: { 'Authorization': `Bearer ${STRAPI_TOKEN}` } }
        );
        
        if (!response.ok) throw new Error(`Error Strapi: ${response.status}`);
        
        const { data } = await response.json();
        console.log('Datos recibidos de Strapi:', data);

        if (!data || data.length === 0) {
            contenido.innerHTML = '<p class="estilo3">No hay películas almacenadas aún.</p>';
            return;
        }
        
        // Mapear los datos correctamente
        const peliculas = data.map(item => item.attributes || item); // Usar attributes para Strapi v4
        
        // Calcular el total de votos para los porcentajes
        const totalVotos = peliculas.reduce((sum, pelicula) => sum + (pelicula.votos_totales || 0), 0);
        
        // Crear HTML para la tabla
        let html = `
            <h3>Películas almacenadas (${peliculas.length})</h3>
            <div class="chart-container">
                <canvas id="pieChart"></canvas>
            </div>
            <table class="movie-table">
                <thead>
                    <tr>
                        <th>Título</th>
                        <th>Fecha Estreno</th>
                        <th>Votos Totales</th>
                        <th>Promedio</th>
                        <th>Géneros</th>
                    </tr>
                </thead>
                <tbody>
                    ${peliculas.map(pelicula => `
                        <tr>
                            <td>${pelicula.titulo || 'N/A'}</td>
                            <td>${pelicula.fecha_estreno || 'N/A'}</td>
                            <td>${pelicula.votos_totales || 'N/A'}</td>
                            <td>${pelicula.promedio_votos?.toFixed(1) || 'N/A'}</td>
                            <td>${pelicula.generos || 'N/A'}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        
        contenido.innerHTML = html;
        
        // Crear el gráfico de torta después de que el HTML se haya renderizado
        if (totalVotos > 0) {
            setTimeout(() => {
                const ctx = document.getElementById('pieChart').getContext('2d');
                new Chart(ctx, {
                    type: 'pie',
                    data: {
                        labels: peliculas.map(p => p.titulo || 'Sin título'),
                        datasets: [{
                            data: peliculas.map(p => p.votos_totales || 0),
                            backgroundColor: [
                                '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
                                '#FF9F40', '#8AC24A', '#607D8B', '#E91E63', '#00BCD4'
                            ],
                            borderWidth: 1
                        }]
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            title: {
                                display: true,
                                text: 'Distribución de votos por película',
                                font: {
                                    size: 16
                                }
                            },
                            tooltip: {
                                callbacks: {
                                    label: function(context) {
                                        const label = context.label || '';
                                        const value = context.raw || 0;
                                        const percentage = totalVotos > 0 ? 
                                            Math.round((value / totalVotos) * 100) : 0;
                                        return `${label}: ${value} votos (${percentage}%)`;
                                    }
                                }
                            }
                        }
                    }
                });
            }, 100);
        }
        
    } catch (error) {
        console.error('Error:', error);
        contenido.innerHTML = `
            <p class="estilo2">Error al cargar datos</p>
            <p>${error.message}</p>
        `;
    }
});
});