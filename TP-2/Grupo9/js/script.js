const TMDB_API_KEY = 'c12576ed5d6ba4ec1644ced83a60a545';
const FOX_COMPANY_ID = 25;
const STRAPI_API_URL = 'https://gestionweb.frlp.utn.edu.ar/api/g9-peliculas-foxes';
const STRAPI_API_TOKEN = '099da4cc6cbb36bf7af8de6f1f241f8c81e49fce15709c4cfcae1313090fa2c1ac8703b0179863b4eb2739ea65ae435e90999adb870d49f9f94dcadd88999763119edca01a6b34c25be92a80ed30db1bcacb20df40e4e7f45542bd501f059201ad578c18a11e4f5cd592cb25d6c31a054409caa99f11b6d2391440e9c72611ea';

const btnCargar = document.getElementById('btnCargarDatos');
const btnVisualizar = document.getElementById('btnVisualizarDatos');
const feedbackArea = document.getElementById('feedback-area');
const chartCanvas = document.getElementById('moviesChart');
const ticketsListDiv = document.getElementById('lista-peliculas');

let myMoviesChart = null;

btnCargar.addEventListener('click', cargarYGuardarPeliculas);  
btnVisualizar.addEventListener('click', obtenerYVisualizarPeliculas); 

async function cargarYGuardarPeliculas() { // Carga y guarda las películas de TMDB en Strapi
    feedbackArea.textContent = "Iniciando proceso... Obteniendo películas ya guardadas en Strapi...";
    try {
        const getResponse = await fetch(STRAPI_API_URL, { // Obtener las películas ya guardadas en Strapi
            headers: { 'Authorization': `Bearer ${STRAPI_API_TOKEN}` } // Usar el token de autorización
        });
        if (!getResponse.ok) throw new Error(`No se pudo obtener la lista de películas existentes (Error ${getResponse.status}).`); // Verificar si la respuesta es correcta
        
        const strapiData = await getResponse.json(); // Parsear la respuesta JSON
        const peliculasExistentes = strapiData.data.map(p => p.titulo); // Extraer los títulos de las películas existentes

        feedbackArea.textContent = `Se encontraron ${peliculasExistentes.length} películas en Strapi. Obteniendo datos de TMDB...`; // Actualizar el feedback con la cantidad de películas existentes

        const discoverUrl = `https://api.themoviedb.org/3/discover/movie?with_companies=${FOX_COMPANY_ID}&sort_by=popularity.desc&api_key=${TMDB_API_KEY}`; // URL para obtener películas de Fox desde TMDB
        const discoverResponse = await fetch(discoverUrl); // Hacer la solicitud a TMDB para obtener películas de Fox
        if (!discoverResponse.ok) throw new Error('No se pudo obtener la lista de películas de TMDB.');
        const discoverData = await discoverResponse.json();
        const top10Movies = discoverData.results.slice(0, 10);

        feedbackArea.textContent = `Comparando y guardando películas nuevas...`; // Actualizar el feedback para indicar que se compararán y guardarán las películas nuevas
        
        let peliculasNuevasGuardadas = 0; 
        const savePromises = top10Movies.map(async (movie) => { // Iterar sobre las películas obtenidas de TMDB
            if (!peliculasExistentes.includes(movie.title)) { // Verificar si la película ya existe en Strapi
                const movieDetailsUrl = `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${TMDB_API_KEY}`;
                const detailsResponse = await fetch(movieDetailsUrl);
                const movieDetails = await detailsResponse.json();

                const generos = movieDetails.genres.map(g => g.name).join(', ');

                const dataParaStrapi = {
                    data: {
                        titulo: movieDetails.title,
                        genero: generos,
                        fecha_estreno: movieDetails.release_date,
                        cantidad_votos: movieDetails.vote_count,
                        promedio_votos: movieDetails.vote_average
                    }
                };

                const postResponse = await fetch(STRAPI_API_URL, { // Hacer la solicitud POST a Strapi para guardar la nueva película
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${STRAPI_API_TOKEN}` },
                    body: JSON.stringify(dataParaStrapi)
                });
                
                if (postResponse.ok) {
                    peliculasNuevasGuardadas++;
                } else {
                    const errorBody = await postResponse.text();
                    console.error(`Error al guardar '${movieDetails.title}' en Strapi: ${postResponse.statusText}`, errorBody);
                }
            } else { // Si la película ya existe, no se guarda
                console.log(`La película '${movie.title}' ya existe en Strapi. Se omitió.`);
            }
        });

        await Promise.all(savePromises); 
        
        if (peliculasNuevasGuardadas > 0) { // Si se guardaron nuevas películas, se actualiza el feedback
            feedbackArea.textContent = `¡Proceso completado! Se guardaron ${peliculasNuevasGuardadas} películas nuevas.`;
        } else {
            feedbackArea.textContent = "Proceso completado. No se encontraron películas nuevas para guardar (probablemente ya existían todas).";
        }
        
    } catch (error) { // Manejo de errores
        feedbackArea.textContent = `Error en el proceso de carga: ${error.message}`;
        console.error("Error detallado en cargarYGuardarPeliculas:", error);
    }
}

async function obtenerYVisualizarPeliculas() { // Obtiene y visualiza las películas guardadas en Strapi
    feedbackArea.textContent = "Obteniendo datos desde Strapi para visualizarlos...";
    if (ticketsListDiv) ticketsListDiv.innerHTML = '';

    try {
        const response = await fetch(STRAPI_API_URL, { // Hacer la solicitud a Strapi para obtener las películas guardadas
            headers: { 'Authorization': `Bearer ${STRAPI_API_TOKEN}` } 
        });
        if (!response.ok) throw new Error(`Error HTTP: ${response.statusText}`); // Verificar si la respuesta es correcta
        const strapiData = await response.json();
        if (!strapiData || !Array.isArray(strapiData.data)) throw new Error("La respuesta de Strapi no tiene el formato esperado.");
        
        const peliculas = strapiData.data.slice(0, 10);
        if (peliculas.length === 0) {
            feedbackArea.textContent = "No hay películas guardadas para visualizar. Carga los datos primero.";
            return;
        }

        feedbackArea.textContent = `Datos obtenidos. Mostrando gráfico y tickets.`;
        
        const labels = peliculas.map(p => p.titulo); // Extraer los títulos de las películas para las etiquetas del gráfico
        const promedios = peliculas.map(p => p.promedio_votos); // Extraer los promedios de votos de las películas

        if (myMoviesChart) { // Si ya existe un gráfico, lo destruimos para evitar duplicados
            myMoviesChart.destroy();
        }

        myMoviesChart = new Chart(chartCanvas, { // Crear un nuevo gráfico de barras
            type: 'bar', 
            data: {
                labels: labels,
                datasets: [{
                    label: 'Promedio de Votos (sobre 10)',
                    data: promedios,
                    backgroundColor: 'rgba(255, 215, 0, 0.7)',
                    borderColor: 'rgba(255, 215, 0, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                indexAxis: 'y', 
                scales: { x: { beginAtZero: true, max: 10 } },
                plugins: { legend: { display: false } }
            }
        });

        if (ticketsListDiv) {
            ticketsListDiv.innerHTML = '';
            
            peliculas.forEach(pelicula => {
                const p = pelicula;
                const ticket = document.createElement('div');
                ticket.className = 'movie-ticket';
                ticket.innerHTML = `
                    <div class="ticket-main">
                        <h3>${p.titulo}</h3>
                        <p><strong>Géneros:</strong> ${p.genero || 'N/A'}</p>
                        <p><strong>Estreno:</strong> ${p.fecha_estreno || 'N/A'}</p>
                        <p><strong>Rating:</strong> ${p.promedio_votos ? p.promedio_votos.toFixed(1) : 'N/A'} / 10 (${p.cantidad_votos || 0} votos)</p>
                    </div>
                    <div class="ticket-stub">
                        <span>ADMIT ONE</span>
                    </div>
                `;
                ticketsListDiv.appendChild(ticket);
            });
        }

    } catch (error) {
        feedbackArea.textContent = `Error al visualizar: ${error.message}`;
        console.error("Error en obtenerYVisualizarPeliculas:", error);
    }
}
