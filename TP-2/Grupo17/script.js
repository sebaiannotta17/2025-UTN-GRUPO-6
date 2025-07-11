const TMDB_API_KEY = '20879d0161b47b71f3762faf13c4c955';
const STRAPI_URL = 'https://gestionweb.frlp.utn.edu.ar/api/g17s';
const STRAPI_TOKEN = '099da4cc6cbb36bf7af8de6f1f241f8c81e49fce15709c4cfcae1313090fa2c1ac8703b0179863b4eb2739ea65ae435e90999adb870d49f9f94dcadd88999763119edca01a6b34c25be92a80ed30db1bcacb20df40e4e7f45542bd501f059201ad578c18a11e4f5cd592cb25d6c31a054409caa99f11b6d2391440e9c72611ea';

async function obtenerPeliculasTomCruise() {
  try {
    // Mostrar mensaje de carga
    const loadingMessage = document.getElementById('loading-message');
    loadingMessage.textContent = 'Limpiando base de datos...';

    // Limpiar todas las películas existentes primero
    try {
      const res = await fetch(`${STRAPI_URL}?pagination[limit]=10`, {
        headers: {
          'Authorization': `Bearer ${STRAPI_TOKEN}`
        }
      });

      const data = await res.json();
      const peliculasExistentes = data.data;

      console.log(`🗑️ Eliminando ${peliculasExistentes.length} películas existentes...`);

      for (const pelicula of peliculasExistentes) {
        await axios.delete(`${STRAPI_URL}/${pelicula.id}`, {
          headers: {
            'Authorization': `Bearer ${STRAPI_TOKEN}`
          }
        });
      }
      console.log('✅ Base de datos limpiada');
    } catch (error) {
      console.log('No hay películas existentes para eliminar');
    }

    loadingMessage.textContent = 'Buscando películas de Tom Cruise...';

    const searchRes = await axios.get(`https://api.themoviedb.org/3/search/person`, {
      params: { api_key: TMDB_API_KEY, query: 'Tom Cruise' }
    });
    const actorId = searchRes.data.results[0].id;

    loadingMessage.textContent = 'Obteniendo lista de películas...';

    const creditsRes = await axios.get(`https://api.themoviedb.org/3/person/${actorId}/movie_credits`, {
      params: { api_key: TMDB_API_KEY }
    });
    const peliculasTop10 = creditsRes.data.cast
      .sort((a, b) => b.vote_count - a.vote_count)
      .slice(0, 10);

    loadingMessage.textContent = 'Guardando películas...';

    let guardadas = 0;
    for (const pelicula of peliculasTop10) {
      const detalleRes = await axios.get(`https://api.themoviedb.org/3/movie/${pelicula.id}`, {
        params: { api_key: TMDB_API_KEY }
      });
      const detalle = detalleRes.data;

      const requestData = {
        data: {
          titulo: detalle.title,
          sinopsis: detalle.overview,
          generos: detalle.genres.map(g => g.name).join(', '),
          cantidadVotos: detalle.vote_count,
          promedioVotos: detalle.vote_average
        }
      };

      await axios.post(STRAPI_URL, requestData, {
        headers: {
          'Authorization': `Bearer ${STRAPI_TOKEN}`,
          'Content-Type': 'application/json'
        },
      });
      console.log(`✔️ Guardada: ${detalle.title}`);
      guardadas++;
    }

    loadingMessage.textContent = `✅ ${guardadas} películas guardadas exitosamente`;
    
    // Limpiar mensaje después de 3 segundos
    setTimeout(() => {
      loadingMessage.textContent = '';
    }, 3000);

  } catch (error) {
    console.error('❌ Error en el proceso:', error.response?.data || error.message);
    loadingMessage.textContent = '❌ Error al cargar películas';
    setTimeout(() => {
      loadingMessage.textContent = '';
    }, 3000);
  }
}