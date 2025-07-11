const API_KEY = 'a5d4e0ae76bfabaab8a130237224bcda';

// URLs para acceder a TMDB(api) y Strapi
const BASE_URL = 'https://api.themoviedb.org/3';
const STRAPI_URL = 'https://gestionweb.frlp.utn.edu.ar/api/grupo20s';

// Token de autenticación para guardar datos en Strapi
const STRAPI_TOKEN = "099da4cc6cbb36bf7af8de6f1f241f8c81e49fce15709c4cfcae1313090fa2c1ac8703b0179863b4eb2739ea65ae435e90999adb870d49f9f94dcadd88999763119edca01a6b34c25be92a80ed30db1bcacb20df40e4e7f45542bd501f059201ad578c18a11e4f5cd592cb25d6c31a054409caa99f11b6d2391440e9c72611ea";

let resultadosGlobales = []; // Array global para guardar los resultados

// Obtenemos los actores, su última película y guarda en Strapi de ser posible
async function obtenerActoresConUltimaPelicula() {
  try {
    const div = document.getElementById('resultado');
    div.innerText = 'Obteniendo actores...';

    //traemos los actores mas populares a TMDB
    const resActores = await fetch(`${BASE_URL}/person/popular?api_key=${API_KEY}&language=es-ES&page=1`);
    if (!resActores.ok) throw new Error(`Error TMDB actores: ${resActores.status}`);
    const dataActores = await resActores.json();

    // Seleccionamos los 10 mas populares
    const top10 = dataActores.results.slice(0, 10);
    const resultados = [];

    // Recorremos cada actor
    for (const actor of top10) {
      div.innerText = `Procesando: ${actor.name}`;

      // Separamos nombre y apellido
      const nombreCompleto = actor.name.trim().split(' ');
      const nombre = nombreCompleto[0];
      const apellido = nombreCompleto.slice(1).join(' ') || '';

      // traemos los créditos de películas del actor
      const resCreditos = await fetch(`${BASE_URL}/person/${actor.id}/movie_credits?api_key=${API_KEY}&language=es-ES`);
      if (!resCreditos.ok) continue;
      const creditos = await resCreditos.json();

      // Filtramos películas con fecha de estreno y las ordenarlamos por fecha
      const pelis = creditos.cast
        .filter(p => p.release_date)
        .sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
      if (pelis.length === 0) continue;

      // Traemos la pelicula más reciente
      const ultima = pelis[0];

      // Traemos detalles de esa película
      const resPeli = await fetch(`${BASE_URL}/movie/${ultima.id}?api_key=${API_KEY}&language=es-ES`);
      if (!resPeli.ok) continue;
      const detalles = await resPeli.json();

      // Creamos el objeto con los datos del actor y su última película
      const datosActor = {
        nombre,
        apellido,
        pelicula: detalles.title,
        estreno: detalles.release_date,
        cantidad_votos: detalles.vote_count,
        promedio_votos: detalles.vote_average,
        generos: detalles.genres?.map(g => g.name) || []
      };

      resultados.push(datosActor);

      // Enviamos los datos a Strapi (si el token válido)
      await fetch(STRAPI_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${STRAPI_TOKEN}`
        },
        body: JSON.stringify({ data: datosActor })
      });
    }

    // Si no se obtuvieron datos, mostramos el error por pantalla
    if (resultados.length === 0) {
      div.innerText = 'No se encontraron datos.';
      return;
    }
    resultadosGlobales = resultados;

    // Mostramos tarjetas de actores
    div.innerHTML = resultados.map(actor => `
      <div class="tarjeta-actor">
        <strong>${actor.nombre} ${actor.apellido}</strong><br>
        <span class="etiqueta">Película:</span> ${actor.pelicula}<br>
        <span class="etiqueta">Fecha de estreno:</span> ${actor.estreno}<br>
        <span class="etiqueta">Votos:</span> ${actor.cantidad_votos} | 
        <span class="etiqueta">Promedio:</span> ${actor.promedio_votos}<br>
        <span class="etiqueta">Géneros:</span>
        <ul>${actor.generos.map(g => `<li>${g}</li>`).join('')}</ul>
      </div>
    `).join('');

    // También mostramos la línea de tiempo
    const timelineDiv = document.getElementById('timeline');
    const eventosOrdenados = [...resultados].sort((a, b) => new Date(a.estreno) - new Date(b.estreno));
    timelineDiv.innerHTML = eventosOrdenados.map(actor => `
      <div class="evento-timeline">
        <strong>${actor.pelicula}</strong><br>
        <small>${actor.estreno}</small> – ${actor.nombre} ${actor.apellido}
      </div>
    `).join('');

  } catch (error) {
    console.error(error);
    document.getElementById('resultado').innerText = `Error: ${error.message}`;
  }
}

// Creación de gráficos usando la libreria Chart.js

// Muestra gráfico de promedios
function mostrarGrafico() {
  const canvas = document.getElementById('graficoPromedios');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  canvas.style.display = 'block';
  document.getElementById('titulo-grafico').style.display = 'block';

  // Crear gráfico de barras con promedios de votos
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: resultadosGlobales.map(a => `${a.nombre} ${a.apellido}`),
      datasets: [{
        label: 'Promedio de votos',
        data: resultadosGlobales.map(a => a.promedio_votos),
        backgroundColor: 'rgba(75, 192, 192, 0.6)'
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Promedio de votos por actor/actriz',
          font: { size: 20 }
        }
      },
      scales: {
        y: { beginAtZero: true, max: 10 }
      }
    }
  });
}

// Traemos actores desde Strapi y los muestra si el acceso esta permitido
async function mostrarActoresDesdeStrapi() {
  try {
    const div = document.getElementById('resultado');
    div.innerText = 'Consultando Strapi...';

    const res = await fetch(`${STRAPI_URL}?populate=*`);
    if (!res.ok) throw new Error('Error accediendo a Strapi.');
    const data = await res.json();
    const actores = data.data;

    if (!actores || actores.length === 0) {
      div.innerText = 'No hay datos en Strapi.';
      return;
    }

    // Mostrar los actores guardados en Strapi (de ser posible)
    div.innerHTML = actores.map(entry => {
      const a = entry.attributes;
      return `
        <div class="tarjeta-actor">
          <strong>${a.nombre} ${a.apellido}</strong><br>
          <span class="etiqueta">Película:</span> ${a.pelicula}<br>
          <span class="etiqueta">Fecha de estreno:</span> ${a.estreno}<br>
          <span class="etiqueta">Votos:</span> ${a.cantidad_votos} | 
          <span class="etiqueta">Promedio:</span> ${a.promedio_votos}<br>
          <span class="etiqueta">Géneros:</span>
          <ul>${a.generos.map(g => `<li>${g}</li>`).join('')}</ul>
        </div>
      `;
    }).join('');
  } catch (err) {
    console.error(err);
    document.getElementById('resultado').innerText = 'No se pudo acceder a Strapi.';
  }
}

// Muestra / oculta gráfico de promedios 
let graficoMostrado = false;
let chartInstance;

function toggleGrafico() {
  const canvas = document.getElementById('graficoPromedios');
  const titulo = document.getElementById('titulo-grafico');
  if (!canvas) return;

  if (!graficoMostrado) {
    // Mostrar gráfico y borra el anterior si ya existe
    canvas.style.display = 'block';
    titulo.style.display = 'block';
    if (chartInstance) chartInstance.destroy();

    const ctx = canvas.getContext('2d');
    chartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: resultadosGlobales.map(a => `${a.nombre} ${a.apellido}`),
        datasets: [{
          label: 'Promedio de votos',
          data: resultadosGlobales.map(a => a.promedio_votos),
          backgroundColor: 'rgba(75, 192, 192, 0.6)'
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Promedio de votos por actor/actriz',
            font: { size: 20 }
          }
        },
        scales: {
          y: { beginAtZero: true, max: 10 }
        }
      }
    });

    graficoMostrado = true;
  } else {
    // Ocultar gráfico
    canvas.style.display = 'none';
    titulo.style.display = 'none';
    graficoMostrado = false;
  }
}

// Muestra / oculta linea de tiempo
let timelineMostrado = false;

function toggleTimeline() {
  const contenedor = document.getElementById('timeline');
  const titulo = document.getElementById('titulo-timeline');

  if (!contenedor) return;

  if (!timelineMostrado) {
    contenedor.style.display = 'block';
    titulo.style.display = 'block';
    timelineMostrado = true;
  } else {
    contenedor.style.display = 'none';
    titulo.style.display = 'none';
    timelineMostrado = false;
  }
}