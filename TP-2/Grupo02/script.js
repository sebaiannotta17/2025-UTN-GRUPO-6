const BEARER_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwYzUyMDJkOWNhMDFhODZhYTc3MTRjMGNjMGNhYzNmNCIsIm5iZiI6MTc1MTcyMjg4My40ODEsInN1YiI6IjY4NjkyYjgzYTcyMmQzODk0YjEwMzA1OCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.NTuSIkQTCWu6H0GNcBpUdhP45UZobLBQmI2xw2hlrkk';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const API_KEY = "099da4cc6cbb36bf7af8de6f1f241f8c81e49fce15709c4cfcae1313090fa2c1ac8703b0179863b4eb2739ea65ae435e90999adb870d49f9f94dcadd88999763119edca01a6b34c25be92a80ed30db1bcacb20df40e4e7f45542bd501f059201ad578c18a11e4f5cd592cb25d6c31a054409caa99f11b6d2391440e9c72611ea"; 
const STRAPI_URL = "https://gestionweb.frlp.utn.edu.ar/api/g2s";
const PAIS_STRAPI_URL = "https://gestionweb.frlp.utn.edu.ar/api/g2-paises"; 
const GENERO_STRAPI_URL = "https://gestionweb.frlp.utn.edu.ar/api/g2-generos"; 

const FETCH_OPTIONS = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${BEARER_TOKEN}`
    }
};

let seriesData = [];

// Obtener un array de géneros de series
async function getGenreMap() {
    const url = `${BASE_URL}/genre/tv/list?language=es-ES`;
    try {
        const response = await fetch(url, FETCH_OPTIONS);
        const data = await response.json();
        const genreMap = new Map();
        data.genres.forEach(genre => {
            genreMap.set(genre.id, genre.name);
        });
        return genreMap;
    } catch (error) {
        console.error('Error al obtener géneros:', error);
        return new Map();
    }
}

// Primero eliminamos lo que haya en Strapi 
// y luego cargamos los datos de las 10 series mas populares
async function Cargar() {
    const contentSection = document.getElementById('content');
    contentSection.innerHTML = '<p class="loading-message">Cargando datos de series populares...</p>';

    const genreMap = await getGenreMap();
    const url = `${BASE_URL}/tv/popular?language=es-ES&page=1`;

    try {
        const response = await fetch(url, FETCH_OPTIONS);
        if (!response.ok) {
            throw new Error(`Error de red: ${response.statusText}`);
        }
        const data = await response.json();
        
        // Obtener los primeros 10 resultados
        seriesData = data.results.slice(0, 10).map(show => ({
            titulo: show.name,
            sinopsis: show.overview,
            fechaDeEstreno: show.first_air_date,
            cantidadDeVotos: show.vote_count,
            promedioDeVotos: show.vote_average,
            generos: show.genre_ids.map(id => genreMap.get(id) || 'Desconocido'), // Mantener como array
            paises: show.origin_country,
            poster: show.poster_path ? `${IMAGE_BASE_URL}${show.poster_path}` : 'https://via.placeholder.com/500x750.png?text=No+Image'
        }));

        // Eliminar los datos existentes en Strapi
        await limpiarStrapi();

        for (const serie of seriesData) {
            try {
                const paisId = await buscarOCrearPais(serie.paises[0]);
                const generoIds = await Promise.all(
                    serie.generos.map(nombreGenero => buscarOCrearGenero(nombreGenero))
                );

                const strapiResponse = await fetch(STRAPI_URL, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${API_KEY}`
                    },
                    body: JSON.stringify({
                        data: {
                            titulo: serie.titulo,
                            sinopsis: serie.sinopsis,
                            fechaDeEstreno: serie.fechaDeEstreno,
                            cantidadDeVotos: serie.cantidadDeVotos,
                            promedioDeVotos: serie.promedioDeVotos,
                            g_2_pai: paisId,
                            g_2_generos: generoIds.filter(id => id),
                            poster: serie.poster
                        }
                    })
                });

                if (!strapiResponse.ok) {
                    const errorData = await strapiResponse.json();
                    console.error(`Error al guardar "${serie.titulo}": ${errorData.error.message}`);
                } else {
                    console.log(`Serie "${serie.titulo}" guardada exitosamente.`);
                }

            } catch (strapiError) {
                console.error(`Error de red al intentar guardar "${serie.titulo}":`, strapiError);
            }
        }

        // Mostrar los datos en formato de tarjetas
        Visualizar();

    } catch (error) {
        console.error('Error al cargar los datos de las series:', error);
        contentSection.innerHTML = `<p class="error-message">No se pudieron cargar los datos. Revisa la consola (F12) para más detalles.</p>`;
    }
}

// Buscar o crear un país en Strapi
async function buscarOCrearPais(nombrePais) {
    const query = `?filters[nombre][$eq]=${nombrePais}`;
    try {
        const searchResponse = await fetch(`${PAIS_STRAPI_URL}${query}`, {
            headers: { "Authorization": `Bearer ${API_KEY}` }
        });
        if (!searchResponse.ok) throw new Error(`Error buscando el país ${nombrePais}`);

        const { data } = await searchResponse.json();

        if (data && data.length > 0) {
            return data[0].id; // Devuelve el ID si ya existe
        }

        // Si no existe, crealo
        const createResponse = await fetch(PAIS_STRAPI_URL, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                data: {
                    nombre: nombrePais
                }
            })
        });

        if (!createResponse.ok) {
            const errorBody = await createResponse.json();
            console.error('Error al crear país:', JSON.stringify(errorBody, null, 2));
            throw new Error(`Error creando el país ${nombrePais}`);
        }
        
        const { data: newData } = await createResponse.json();
        return newData.id; 

    } catch (error) {
        console.error("Error en buscarOCrearPais:", error);
        return null;
    }
}

// Buscar o crear un género en Strapi
async function buscarOCrearGenero(nombreGenero) {
    const query = `?filters[nombre][$eq]=${nombreGenero}`;
    try {
        const searchResponse = await fetch(`${GENERO_STRAPI_URL}${query}`, {
            headers: { "Authorization": `Bearer ${API_KEY}` }
        });
        if (!searchResponse.ok) throw new Error(`Error buscando el género ${nombreGenero}`);

        const { data } = await searchResponse.json();

        if (data && data.length > 0) {
            return data[0].id; // Devuelve el ID si ya existe
        }

        // Si no existe, crealo
        const createResponse = await fetch(GENERO_STRAPI_URL, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                data: {
                    nombre: nombreGenero
                }
            })
        });

        if (!createResponse.ok) {
            const errorBody = await createResponse.json();
            console.error('Error al crear género:', JSON.stringify(errorBody, null, 2));
            throw new Error(`Error creando el género ${nombreGenero}`);
        }
        
        const { data: newData } = await createResponse.json();
        return newData.id; 

    } catch (error) {
        console.error("Error en buscarOCrearGenero:", error);
        return null;
    }
}


async function limpiarStrapi() {
    console.log("Iniciando limpieza de datos en Strapi...");
    try {
        const response = await fetch(STRAPI_URL, {
            headers: { "Authorization": `Bearer ${API_KEY}` }
        });

        if (!response.ok) throw new Error("No se pudo obtener la lista de items para eliminar.");

        const { data } = await response.json();

        if (!data || data.length === 0) {
            console.log("No hay datos en Strapi para eliminar.");
            return;
        }

        const deletePromises = data.map(item =>
            fetch(`${STRAPI_URL}/${item.documentId}`, {
                method: 'DELETE',
                headers: { "Authorization": `Bearer ${API_KEY}` }
            })
        );

        await Promise.all(deletePromises);
        console.log("Todos los datos en Strapi han sido eliminados exitosamente.");
    } catch (error) {
        console.error("Error durante el proceso de limpieza de Strapi:", error);
    }
}

// Conviertir un código de país de 2 letras en un emoji de bandera
function getFlagEmoji(countryCode) {
    if (!countryCode || countryCode.length !== 2) {
        return '';
    }
    const codePoints = countryCode
        .toUpperCase()
        .split('')
        .map(char => 0x1F1E6 + char.charCodeAt(0) - 65);
    return String.fromCodePoint(...codePoints);
}

async function Visualizar() {
    const contentSection = document.getElementById('content');
    contentSection.innerHTML = '<p class="loading-message">Obteniendo datos desde Strapi...</p>';

    try {
        // Llamar a la API de Strapi para obtener los datos, populando las relaciones
        // Usamos una sintaxis de objeto para `populate` que es más robusta.
        const response = await fetch(`${STRAPI_URL}?populate[g_2_pai][populate]=*&populate[g_2_generos][populate]=*`, {
            headers: { "Authorization": `Bearer ${API_KEY}` }
        });

        if (!response.ok) {
            throw new Error("No se pudieron obtener los datos de Strapi.");
        }

        const { data } = await response.json();

        if (!data || data.length === 0) {
            contentSection.innerHTML = '<p>No hay datos guardados en Strapi para mostrar.</p>';
            return;
        }

        // Limpiar el contenido
        contentSection.innerHTML = ''; 
        const genreCounts = {}; // Objeto para contar géneros

        data.forEach(item => { 
            const card = document.createElement('div');
            card.className = 'serie-card';

            // Acceder al nombre del país y obtener su bandera
            const paisCode = item.g_2_pai ? item.g_2_pai.nombre : null;
            const paisDeRelacion = paisCode || 'No disponible';
            const flagEmoji = getFlagEmoji(paisCode);

            // Acceder a los nombres de los géneros y contarlos para el gráfico
            const generosDeRelacion = item.g_2_generos && item.g_2_generos.length > 0
                ? item.g_2_generos.map(g => {
                    if (g.nombre) {
                        genreCounts[g.nombre] = (genreCounts[g.nombre] || 0) + 1;
                    }
                    return g.nombre;
                }).join(', ')
                : 'No disponible';

            card.innerHTML = `
                <img src="${item.poster}" alt="Póster de ${item.titulo}">
                <div class="serie-info">
                    <h3>${item.titulo}</h3>
                    <p><strong>Fecha de Estreno:</strong> ${item.fechaDeEstreno}</p>
                    <p><strong>País:</strong> ${flagEmoji} ${paisDeRelacion}</p>
                    <p><strong>Géneros:</strong> ${generosDeRelacion}</p>
                    <p><strong>Votos:</strong> ${item.cantidadDeVotos} (Promedio: ${item.promedioDeVotos})</p>
                    <p class="sinopsis"><strong>Sinopsis:</strong> ${item.sinopsis || 'No disponible.'}</p>
                </div>
            `;
            contentSection.appendChild(card);
        });

        // Mostrar el contenedor del gráfico y luego renderizar el gráfico
        const chartContainer = document.querySelector('.chart-container');
        if (chartContainer) {
            chartContainer.style.display = 'block';
        }
        renderGenreChart(genreCounts);

    } catch (error) {
        console.error("Error al obtener datos de Strapi:", error);
        contentSection.innerHTML = `<p class="error-message">No se pudieron cargar los datos desde Strapi. Revisa la consola.</p>`;
    }
}

function renderGenreChart(genreData) {
    const ctx = document.getElementById('genreChart').getContext('2d');
    
    // Destruir el gráfico anterior si existe para evitar solapamientos al recargar
    if (window.myGenreChart) {
        window.myGenreChart.destroy();
    }

    const labels = Object.keys(genreData);
    const data = Object.values(genreData);

    window.myGenreChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Popularidad de Géneros (Nº de Series)',
                data: data,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1 // Para asegurar que el eje Y solo muestre enteros
                    }
                }
            },
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Distribución de Géneros en las Series Populares'
                }
            }
        }
    });
}