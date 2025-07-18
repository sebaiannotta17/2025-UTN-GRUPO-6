const API_KEY = 'a5d4e0ae76bfabaab8a130237224bcda';
const BASE_URL = 'https://api.themoviedb.org/3';
const STRAPI_URL_PELICULAS = 'https://gestionweb.frlp.utn.edu.ar/api/g30-peliculas';
const STRAPI_TOKEN = "099da4cc6cbb36bf7af8de6f1f241f8c81e49fce15709c4cfcae1313090fa2c1ac8703b0179863b4eb2739ea65ae435e90999adb870d49f9f94dcadd88999763119edca01a6b34c25be92a80ed30db1bcacb20df40e4e7f45542bd501f059201ad578c18a11e4f5cd592cb25d6c31a054409caa99f11b6d2391440e9c72611ea";

let resultadosActores = [];

async function obtenerActoresConUltimaPelicula() {
  try {
    ocultarGraficoGeneros();
    ocultarGraficoComparacion();

    document.getElementById('resultado').style.display = 'block';

    const div = document.getElementById('resultado');
    div.innerText = 'Obteniendo actores populares...';

    const resActores = await fetch(`${BASE_URL}/person/popular?api_key=${API_KEY}&language=es-ES&page=1`);
    if (!resActores.ok) throw new Error(`Error TMDB actores: ${resActores.status}`);
    const dataActores = await resActores.json();

    const top10 = dataActores.results.slice(0, 10);
    const resultados = [];

    for (const actor of top10) {
      const nombreCompleto = actor.name.trim().split(' ');
      const nombre = nombreCompleto[0];
      const apellido = nombreCompleto.slice(1).join(' ') || '';

      const resCreditos = await fetch(`${BASE_URL}/person/${actor.id}/movie_credits?api_key=${API_KEY}&language=es-ES`);
      if (!resCreditos.ok) continue;
      const creditos = await resCreditos.json();

      const pelis = creditos.cast.filter(p => p.release_date).sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
      if (pelis.length === 0) continue;

      const ultima = pelis[0];

      const resPeli = await fetch(`${BASE_URL}/movie/${ultima.id}?api_key=${API_KEY}&language=es-ES`);
      if (!resPeli.ok) continue;
      const detalles = await resPeli.json();

      const datosActor = {
        titulo: detalles.title,
        fecha_estreno: detalles.release_date,
        cantidad_votos: detalles.vote_count,
        promedio_votos: detalles.vote_average,
        nombre: nombre,
        apellido: apellido,
        generos: detalles.genres?.map(g => g.name) || [],
      };
      resultados.push(datosActor);

      const postRes = await fetch(STRAPI_URL_PELICULAS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${STRAPI_TOKEN}`,
        },
        body: JSON.stringify({ data: datosActor })
      });

      if (!postRes.ok) {
        console.error('Error al guardar actor en Strapi:', postRes.status);
        continue;
      }

      const postData = await postRes.json();
      console.log('Strapi devolvió:', postData);
    }

    if (resultados.length === 0) {
      div.innerText = 'No se encontraron datos.';
      return;
    } else {
      div.innerText = 'Datos cargados a Strapi';
    }

  } catch (error) {
    console.error(error);
    document.getElementById('resultado').innerText = `Error: ${error.message}`;
  }
}

async function mostrarActoresDesdeStrapi() {
  try {
    ocultarGraficoGeneros();
    ocultarGraficoComparacion();

    document.getElementById('resultado').style.display = 'block';

    const div = document.getElementById('resultado');
    div.innerText = 'Consultando Strapi...';

    const res = await fetch(`${STRAPI_URL_PELICULAS}?pagination[limit]=10&sort[0]=id:asc`, {
      headers: {
        'Authorization': `Bearer ${STRAPI_TOKEN}`
      }
    });
    if (!res.ok) throw new Error('Error accediendo a Strapi.');

    const data = await res.json();
    const actores = data.data;

    if (!actores || actores.length === 0) {
      div.innerText = 'No hay datos en Strapi.';
      return;
    }

    div.innerHTML = actores.map(a => `
      <div class="tarjeta-actor">
        <strong>${a.nombre} ${a.apellido}</strong><br>
        <span class="etiqueta">Película:</span> ${a.titulo}<br>
        <span class="etiqueta">Fecha de estreno:</span> ${a.fecha_estreno}<br>
        <span class="etiqueta">Votos:</span> ${a.cantidad_votos} | 
        <span class="etiqueta">Promedio:</span> ${a.promedio_votos}<br>
        <span class="etiqueta">Géneros:</span>
        <ul>${(a.generos || []).map(g => `<li>${g}</li>`).join('')}</ul>
      </div>
    `).join('');

  } catch (err) {
    console.error(err);
    document.getElementById('resultado').innerText = 'No se pudo acceder a Strapi.';
  }
}

async function mostrarGraficoGeneros() {
  try {
    ocultarGraficoGeneros();
    ocultarGraficoComparacion();

    const divResultado = document.getElementById('resultado');
    divResultado.style.display = 'none';

    const res = await fetch(`${STRAPI_URL_PELICULAS}?pagination[limit]=100`, {
      headers: {
        'Authorization': `Bearer ${STRAPI_TOKEN}`
      }
    });
    if (!res.ok) throw new Error('Error accediendo a Strapi para gráfico.');

    const data = await res.json();
    const actores = data.data;

    if (!actores || actores.length === 0) {
      alert('No hay datos para mostrar en el gráfico.');
      return;
    }

    generarGraficoGeneros(actores);
  } catch (err) {
    console.error(err);
    alert('Error generando gráfico.');
  }
}

function generarGraficoGeneros(actores) {
  const conteoGeneros = {};

  actores.forEach(a => {
    const generos = a.generos || a.attributes?.generos || [];
    generos.forEach(g => {
      conteoGeneros[g] = (conteoGeneros[g] || 0) + 1;
    });
  });

  const labels = Object.keys(conteoGeneros);
  const data = Object.values(conteoGeneros);
  const total = data.reduce((a, b) => a + b, 0);
  const porcentajes = data.map(valor => ((valor / total) * 100).toFixed(1));

  const colores = labels.map(() =>
    `hsl(${Math.floor(Math.random() * 360)}, 60%, 60%)`
  );

  const canvas = document.getElementById('graficoGeneros');
  canvas.style.display = 'block';

  if (window.graficoGenerosChart) {
    window.graficoGenerosChart.destroy();
  }

  const ctx = canvas.getContext('2d');
  window.graficoGenerosChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: labels.map((l, i) => `${l} (${porcentajes[i]}%)`),
      datasets: [{
        label: 'Distribución de géneros',
        data: data,
        backgroundColor: colores,
        borderColor: '#fff',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'bottom' },
        title: { display: true, text: 'Porcentaje de cada género' }
      }
    }
  });
}

function ocultarGraficoGeneros() {
  const canvas = document.getElementById('graficoGeneros');
  if (canvas) {
    if (window.graficoGenerosChart) {
      window.graficoGenerosChart.destroy();
      window.graficoGenerosChart = null;
    }

    canvas.style.display = 'none';
    canvas.width = canvas.width;
  }
}

async function mostrarGraficoComparacion() {
  try {
    ocultarGraficoGeneros();
    ocultarGraficoComparacion();

    // Oculta el contenido anterior
    const divResultado = document.getElementById('resultado');
    divResultado.style.display = 'none';

    const res = await fetch(`${STRAPI_URL_PELICULAS}?pagination[limit]=100`, {
      headers: {
        'Authorization': `Bearer ${STRAPI_TOKEN}`
      }
    });
    if (!res.ok) throw new Error('Error accediendo a Strapi para gráfico.');

    const data = await res.json();
    const actores = data.data;

    if (!actores || actores.length === 0) {
      alert('No hay datos para mostrar.');
      return;
    }

    generarGraficoComparacion(actores);
  } catch (err) {
    console.error(err);
    alert('Error generando gráfico de comparación.');
  }
}

function generarGraficoComparacion(actores) {
  const canvas = document.getElementById('graficoComparacion');
  canvas.style.display = 'block';

  if (window.graficoComparacionChart) {
    window.graficoComparacionChart.destroy();
  }

  const peliculasMap = new Map();

  actores.forEach(p => {
    const titulo = p.titulo;
    if (!peliculasMap.has(titulo)) {
      peliculasMap.set(titulo, {
        titulo: titulo,
        promedio_votos: parseFloat(p.promedio_votos),
        fecha_estreno: p.fecha_estreno
      });
    }
  });

  const peliculasUnicas = Array.from(peliculasMap.values())
  .filter(p => p.promedio_votos > 0)
  .sort((a, b) => new Date(b.fecha_estreno) - new Date(a.fecha_estreno))
  .slice(-10); // las 10 últimas con votos


  const titulos = peliculasUnicas.map(p => p.titulo);
  const promedios = peliculasUnicas.map(p => p.promedio_votos);
  const promedioTotal = promedios.length > 0
  ? promedios.reduce((a, b) => a + b, 0) / promedios.length
  : 0;

  const ctx = canvas.getContext('2d');
  window.graficoComparacionChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: titulos,
      datasets: [
        {
          label: 'Promedio por película',
          data: promedios,
          backgroundColor: 'rgba(30, 144, 255, 0.75)',
          borderRadius: 6,
          barPercentage: 0.6,
          categoryPercentage: 0.7
        },
        {
          label: `Promedio general (${promedioTotal.toFixed(2)})`,
          data: new Array(promedios.length).fill(promedioTotal),
          type: 'line',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 2,
          borderDash: [5, 5],
          fill: false,
          tension: 0,
          pointRadius: 0
        }
      ]
    },
    options: {
      layout: { padding: 10 },
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            font: {
              size: 13,
              family: 'Arial',
              weight: 'bold'
            }
          }
        },
        title: {
          display: true,
          text: 'Comparación de promedios de votos',
          font: {
            size: 18,
            family: 'Arial',
            weight: 'bold'
          }
        },
        tooltip: {
          backgroundColor: '#222',
          titleFont: { size: 14 },
          bodyFont: { size: 12 },
          padding: 10,
          cornerRadius: 4
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: {
            font: { size: 11, family: 'Arial' },
            autoSkip: false,
            maxRotation: 45,
            minRotation: 0
          }
        },
        y: {
          beginAtZero: true,
          max: 10,
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          },
          ticks: {
            font: { size: 12 }
          }
        }
      },
      animation: {
        duration: 1000,
        easing: 'easeOutQuart'
      }
    }
  });
}

function ocultarGraficoComparacion() {
  const canvas = document.getElementById('graficoComparacion');
  if (canvas) {
    if (window.graficoComparacionChart) {
      window.graficoComparacionChart.destroy();
      window.graficoComparacionChart = null;
    }
    canvas.style.display = 'none';
    canvas.width = canvas.width;
  }
}