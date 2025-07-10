// --- CONFIGURACIÓN ---
const TMDB_API_KEY = '7a0da2a763bb92d8230a59dab03bd601';
const STRAPI_API_TOKEN = '099da4cc6cbb36bf7af8de6f1f241f8c81e49fce15709c4cfcae1313090fa2c1ac8703b0179863b4eb2739ea65ae435e90999adb870d49f9f94dcadd88999763119edca01a6b34c25be92a80ed30db1bcacb20df40e4e7f45542bd501f059201ad578c18a11e4f5cd592cb25d6c31a054409caa99f11b6d2391440e9c72611ea'; 
const STRAPI_API_URL = 'https://gestionweb.frlp.utn.edu.ar/api/nombre-de-tu-coleccion';

// --- LÓGICA DE THE MOVIE DB ---
async function fetchGenresFromTMDB() {
  const url = `https://api.themoviedb.org/3/genre/movie/list?api_key=${TMDB_API_KEY}&language=es-ES`;
  const response = await fetch(url);
  const data = await response.json();
  return data.genres;
}

async function countMoviesInGenre(genreId) {
  const url = `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${genreId}`;
  const response = await fetch(url);
  const data = await response.json();
  return data.total_results;
}

// --- LÓGICA DE STRAPI ---
async function saveDataToStrapi(data) {
    // Primero, borramos los datos existentes para no duplicar
    await deleteExistingDataFromStrapi();

    for (const item of data) {
         const payload = {
            data: {
                nombre: item.nombre,
                conteo: item.conteo
            }
        };
        try {
            await fetch(STRAPI_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${STRAPI_API_TOKEN}`
                },
                body: JSON.stringify(payload)
            });
        } catch (error) {
            console.error('Error guardando en Strapi:', error);
        }
    }
}

async function deleteExistingDataFromStrapi() {
    try {
        const response = await fetch(STRAPI_API_URL, {
            headers: { 'Authorization': `Bearer ${STRAPI_API_TOKEN}` }
        });
        const { data } = await response.json();
        for (const item of data) {
            await fetch(`${STRAPI_API_URL}/${item.id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${STRAPI_API_TOKEN}` }
            });
        }
    } catch (error) {
        console.error('Error eliminando datos de Strapi:', error);
    }
}

async function fetchDataFromStrapi() {
    try {
        const response = await fetch(STRAPI_API_URL, {
            headers: { 'Authorization': `Bearer ${STRAPI_API_TOKEN}` }
        });
        const { data } = await response.json();
        // Strapi devuelve los datos anidados en 'attributes', los extraemos.
        return data.map(item => ({
            nombre: item.attributes.nombre,
            conteo: item.attributes.conteo
        }));
    } catch (error) {
        console.error('Error al obtener datos de Strapi:', error);
        return [];
    }
}


// --- CONTROLADORES DE EVENTOS ---
async function cargarDatos() {
  const mainContent = document.getElementById('main-content');
  mainContent.innerHTML = '<h2>Procesando...</h2><p>Obteniendo géneros y contando películas desde The Movie DB. Esto puede tardar unos momentos.</p>';

  const genres = await fetchGenresFromTMDB();
  const genresWithCounts = [];

  for (const genre of genres) {
    const count = await countMoviesInGenre(genre.id);
    genresWithCounts.push({ nombre: genre.name, conteo: count });
  }

  // Ordenar y tomar el top 10
  genresWithCounts.sort((a, b) => b.conteo - a.conteo);
  const top10Genres = genresWithCounts.slice(0, 10);

  mainContent.innerHTML += '<p>Enviando datos a Strapi...</p>';
  await saveDataToStrapi(top10Genres);

  mainContent.innerHTML = '<h2>¡Proceso Completo!</h2><p>Los 10 géneros más populares han sido cargados en Strapi. Ahora puedes visualizarlos.</p>';
}

async function visualizarDatos() {
  const mainContent = document.getElementById('main-content');
  mainContent.innerHTML = '<h2>Cargando datos desde Strapi...</h2>';

  const data = await fetchDataFromStrapi();

  if (data.length === 0) {
    mainContent.innerHTML = '<h2>Sin datos</h2><p>No se encontraron datos en Strapi. Por favor, "Cargar datos de APIs" primero.</p>';
    return;
  }

  // Ordenar por si acaso los datos de Strapi no vienen ordenados
  data.sort((a, b) => b.conteo - a.conteo);

  let content = '<h2>Top 10 Géneros Más Populares</h2>';
  content += '<ol class="genre-list">';
  data.forEach(genre => {
    content += `<li class="genre-item">${genre.nombre} <span class="count">${genre.conteo.toLocaleString('es-AR')} películas</span></li>`;
  });
  content += '</ol>';
  content += '<canvas id="chart" width="400" height="260" style="margin-top:32px;"></canvas>';

  mainContent.innerHTML = content;

  // --- GRAFICO DE BARRAS ---
  const ctx = document.getElementById('chart').getContext('2d');
  const chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: data.map(g => g.nombre),
      datasets: [{
        label: 'Cantidad de películas',
        data: data.map(g => g.conteo),
        backgroundColor: 'rgba(120,180,255,0.7)',
        borderColor: 'rgba(120,180,255,1)',
        borderWidth: 2,
        borderRadius: 8,
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        title: { display: false }
      },
      scales: {
        x: {
          ticks: { color: '#fff', font: { weight: 'bold' } },
          grid: { color: 'rgba(255,255,255,0.08)' }
        },
        y: {
          beginAtZero: true,
          ticks: { color: '#fff' },
          grid: { color: 'rgba(255,255,255,0.08)' }
        }
      }
    }
  });
}

function visualizarDatosPrueba() {
  const mainContent = document.getElementById('main-content');
  // Datos de ejemplo
  const data = [
    { nombre: 'Acción', conteo: 1200 },
    { nombre: 'Comedia', conteo: 950 },
    { nombre: 'Drama', conteo: 870 },
    { nombre: 'Aventura', conteo: 800 },
    { nombre: 'Animación', conteo: 700 },
    { nombre: 'Terror', conteo: 650 },
    { nombre: 'Ciencia Ficción', conteo: 600 },
    { nombre: 'Romance', conteo: 550 },
    { nombre: 'Suspenso', conteo: 500 },
    { nombre: 'Fantasía', conteo: 450 }
  ];

  let content = '<h2>Top 10 Géneros Más Populares (Prueba)</h2>';
  content += '<ol class="genre-list">';
  data.forEach(genre => {
    content += `<li class="genre-item">${genre.nombre} <span class="count">${genre.conteo.toLocaleString('es-AR')} películas</span></li>`;
  });
  content += '</ol>';
  content += '<canvas id="chart" width="400" height="260" style="margin-top:32px;"></canvas>';

  mainContent.innerHTML = content;

  // --- GRAFICO DE BARRAS ---
  const ctx = document.getElementById('chart').getContext('2d');
  const chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: data.map(g => g.nombre),
      datasets: [{
        label: 'Cantidad de películas',
        data: data.map(g => g.conteo),
        backgroundColor: 'rgba(120,180,255,0.7)',
        borderColor: 'rgba(120,180,255,1)',
        borderWidth: 2,
        borderRadius: 8,
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        title: { display: false }
      },
      scales: {
        x: {
          ticks: { color: '#fff', font: { weight: 'bold' } },
          grid: { color: 'rgba(255,255,255,0.08)' }
        },
        y: {
          beginAtZero: true,
          ticks: { color: '#fff' },
          grid: { color: 'rgba(255,255,255,0.08)' }
        }
      }
    }
  });
}