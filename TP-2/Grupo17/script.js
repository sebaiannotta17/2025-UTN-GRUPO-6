import { renderGrafico } from './chart.js';

const TMDB_API_KEY = '20879d0161b47b71f3762faf13c4c955';
const STRAPI_URL = 'https://gestionweb.frlp.utn.edu.ar/api/g17s';
const STRAPI_TOKEN = '099da4cc6cbb36bf7af8de6f1f241f8c81e49fce15709c4cfcae1313090fa2c1ac8703b0179863b4eb2739ea65ae435e90999adb870d49f9f94dcadd88999763119edca01a6b34c25be92a80ed30db1bcacb20df40e4e7f45542bd501f059201ad578c18a11e4f5cd592cb25d6c31a054409caa99f11b6d2391440e9c72611ea';

async function obtenerPeliculasTomCruise() {
  // Obtener el elemento de mensaje de carga al inicio de la función
  const loadingMessage = document.getElementById('loading-message');
  
  // Ocultar el gráfico cuando se cargan nuevas películas
  const graficoSection = document.getElementById('grafico-section');
  if (graficoSection) {
    graficoSection.style.display = 'none';
  }
  
  try {
    // Mostrar mensaje de carga
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

async function mostrarPeliculas() {
  const container = document.getElementById('peliculas-container');
  container.innerHTML = '<p>Cargando películas...</p>';

      try {
      // Obtener películas sin ordenamiento (más eficiente)
      const res = await fetch(`${STRAPI_URL}?pagination[limit]=10`, {
        headers: {
          'Authorization': `Bearer ${STRAPI_TOKEN}`
        }
      });

    const data = await res.json();
    const peliculas = data.data;

    container.innerHTML = '';

    // Debug: mostrar información de las películas obtenidas
    console.log('🔍 Películas obtenidas:', peliculas.length);
    console.log('🔍 Información de paginación:', data.meta?.pagination);
    console.log('🔍 Títulos y votos de las películas:');
    peliculas.forEach((p, index) => {
      console.log(`  ${index + 1}. ${p.titulo} - Votos: ${p.cantidadVotos}`);
    });

    if (!peliculas || peliculas.length === 0) {
      container.innerHTML = '<p>No hay películas guardadas aún.</p>';
      return;
    }

    // Filtrar películas únicas por título
    const peliculasUnicas = [];
    const titulosVistos = new Set();

    peliculas.forEach(p => {
      const titulo = p.titulo || '(Sin título)';
      
      // Solo agregar si no hemos visto este título antes
      if (!titulosVistos.has(titulo)) {
        titulosVistos.add(titulo);
        peliculasUnicas.push(p);
        console.log(`✅ Agregada película única: ${titulo}`);
      } else {
        console.log(`❌ Película duplicada omitida: ${titulo}`);
      }
    });

    console.log('🔍 Películas únicas encontradas:', peliculasUnicas.length);

    // Ordenar las películas únicas por votos (de mayor a menor)
    peliculasUnicas.sort((a, b) => (b.cantidadVotos || 0) - (a.cantidadVotos || 0));
    console.log('🔍 Películas únicas ordenadas por votos');

    // Mostrar solo las películas únicas
    peliculasUnicas.forEach(p => {
      const titulo = p.titulo || '(Sin título)';
      const sinopsis = p.sinopsis || '(Sin sinopsis)';
      const generos = Array.isArray(p.generos) ? p.generos.join(', ') : p.generos || '-';
      const votos = p.cantidadVotos ?? 0;
      const promedio = p.promedioVotos ?? 0;

      const card = document.createElement('div');
      card.className = 'pelicula-card';
      card.innerHTML = `
        <h3>${titulo}</h3>
        <p><strong>Géneros:</strong> ${generos}</p>
        <p><strong>Votos:</strong> ${votos}</p>
        <p><strong>Promedio:</strong> ${promedio}</p>
        <p>${sinopsis}</p>
      `;
      container.appendChild(card);
    });

    // Mostrar la sección del gráfico y renderizar el gráfico de torta
    const graficoSection = document.getElementById('grafico-section');
    if (graficoSection) {
      graficoSection.style.display = 'block';
    }
    renderGrafico(peliculasUnicas);

  } catch (error) {
    container.innerHTML = '<p>Error al cargar películas.</p>';
    console.error('❌ Error al obtener películas:', error);
  }
}

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
  // Verificar que todos los elementos existan antes de agregar event listeners
  const btnCargar = document.getElementById('btn-cargar');
  const btnMostrar = document.getElementById('btn-mostrar');

  if (btnCargar) {
    btnCargar.addEventListener('click', obtenerPeliculasTomCruise);
  } else {
    console.error('❌ Elemento btn-cargar no encontrado');
  }

  if (btnMostrar) {
    btnMostrar.addEventListener('click', mostrarPeliculas);
  } else {
    console.error('❌ Elemento btn-mostrar no encontrado');
  }
});
