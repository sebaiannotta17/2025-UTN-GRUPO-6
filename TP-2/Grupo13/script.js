const apiKey = '7a0da2a763bb92d8230a59dab03bd601';
const strapiToken = '099da4cc6cbb36bf7af8de6f1f241f8c81e49fce15709c4cfcae1313090fa2c1ac8703b0179863b4eb2739ea65ae435e90999adb870d49f9f94dcadd88999763119edca01a6b34c25be92a80ed30db1bcacb20df40e4e7f45542bd501f059201ad578c18a11e4f5cd592cb25d6c31a054409caa99f11b6d2391440e9c72611ea';
const urlApi = `https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&first_air_date.gte=2020-01-01&sort_by=popularity.desc&page=1`;
const strapiUrl = 'https://gestionweb.frlp.utn.edu.ar/api/G13_serie';

let generoLookup = {};
let chartInstance = null;

async function obtenerGeneros() {
  const res = await fetch(`https://api.themoviedb.org/3/genre/tv/list?api_key=${apiKey}&language=es-ES`);
  const data = await res.json();
  data.genres.forEach(g => {
    generoLookup[g.id] = g.name;
  });
}

function mostrarSeries(series) {
  const resultado = document.getElementById('resultado');
  resultado.innerHTML = "";
  series.forEach(serie => {
    resultado.innerHTML += `
      <div class="card">
        <h3>${serie.name}</h3>
        <p><strong>Géneros:</strong> ${serie.genre_ids.map(id => generoLookup[id] || id).join(", ")}</p>
        <p><strong>Sinopsis:</strong> ${serie.overview}</p>
        <p><strong>Votos:</strong> ${serie.vote_count}</p>
        <p><strong>Promedio:</strong> ${serie.vote_average}</p>
      </div>
    `;
  });

  // Mostrar grafico de promedios
  mostrarGrafico(series.map(s => s.name), series.map(s => s.vote_average));
}

function mostrarGrafico(labels, data) {
  const ctx = document.getElementById('graficoSeries').getContext('2d');
  if (chartInstance) {
    chartInstance.destroy();
  }
  chartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Promedio de votos',
        data: data,
        backgroundColor: 'rgba(33, 150, 243, 0.6)',
        borderColor: 'rgba(33, 150, 243, 1)',
        borderWidth: 1,
        borderRadius: 5
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        title: { display: true, text: 'Promedio de votos de las series' }
      },
      scales: {
        y: { beginAtZero: true, max: 10 }
      }
    }
  });
}

async function cargarSeries() {
  const resultado = document.getElementById('resultado');
  resultado.innerHTML = "<p>Cargando datos de series...</p>";
  try {
    await obtenerGeneros();
    const res = await fetch(urlApi);
    const data = await res.json();
    const series = data.results.slice(0, 10);

    resultado.innerHTML = "<p>Guardando datos en Strapi...</p>";
    let uploadsExitosos = 0;

    for (const serie of series) {
      const generos = serie.genre_ids.map(id => generoLookup[id] || id).join(", ");
      const serieData = {
        titulo: serie.name,
        sinopsis: serie.overview,
        generos: generos,
        votos_promedio: serie.vote_average,
        cantidad_votos: serie.vote_count
      };

      try {
        const resStrapi = await fetch(strapiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${strapiToken}`
          },
          body: JSON.stringify({ data: serieData })
        });
        if (resStrapi.ok) {
          uploadsExitosos++;
        } else {
          console.error("Error al guardar serie en Strapi:", await resStrapi.text());
        }
      } catch (error) {
        console.error("Error de red al contactar Strapi:", error);
      }
    }

    if (uploadsExitosos === series.length) {
      resultado.innerHTML = `<p>✔ Los datos se guardaron correctamente en Strapi.</p>`;
    } else if (uploadsExitosos > 0) {
      resultado.innerHTML = `<p>⚠ Se guardaron ${uploadsExitosos} de ${series.length} series. Revise la consola para más detalles.</p>`;
    } else {
      resultado.innerHTML = `<p>❌ No se pudo guardar ninguna serie en Strapi. Revise la consola para más detalles.</p>`;
    }

    // Mostrar los top 10 siempre, aunque falle el guardado
    mostrarSeries(series);

  } catch (error) {
    console.error("Error en cargarSeries:", error);
    resultado.innerHTML = `<p>❌ ${error.message}.</p>`;
  }
}

async function visualizarSeries() {
  const resultado = document.getElementById('resultado');
  resultado.innerHTML = "<p>Cargando datos guardados...</p>";
  try {
    const res = await fetch(strapiUrl, {
      headers: {
        'Authorization': `Bearer ${strapiToken}`
      }
    });
    const data = await res.json();
    if (!data || !Array.isArray(data.data)) {
      throw new Error("La respuesta de Strapi no es una colección válida.");
    }
    if (data.data.length === 0) {
      resultado.innerHTML = "<p>No se encontraron datos en Strapi. Puede que necesites cargarlos primero.</p>";
      return;
    }
    resultado.innerHTML = "";
    data.data.forEach(item => {
      const attrs = item.attributes || item;
      resultado.innerHTML += `
        <div class="card">
          <h3>${attrs.titulo}</h3>
          <p><strong>Géneros:</strong> ${attrs.generos}</p>
          <p><strong>Sinopsis:</strong> ${attrs.sinopsis}</p>
          <p><strong>Votos:</strong> ${attrs.cantidad_votos}</p>
          <p><strong>Promedio:</strong> ${attrs.votos_promedio}</p>
        </div>
      `;
    });
  } catch (error) {
    console.error("Error en visualizarSeries:", error);
    resultado.innerHTML = `<p>❌ Error al mostrar los datos: ${error.message}</p>`;
  }
}

// Esperar a que el DOM este listo antes de asociar los listeners
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('btnCargarGuardar').addEventListener('click', cargarSeries);
  document.getElementById('btnVisualizar').addEventListener('click', visualizarSeries);
});