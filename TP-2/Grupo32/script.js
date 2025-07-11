const apiKey = "7a0da2a763bb92d8230a59dab03bd601";
const strapiDirectorURL = "https://gestionweb.frlp.utn.edu.ar/api/g32-directors";
const strapiPeliURL = "https://gestionweb.frlp.utn.edu.ar/api/g32-peliculas";
const token =
  "099da4cc6cbb36bf7af8de6f1f241f8c81e49fce15709c4cfcae1313090fa2c1ac8703b0179863b4eb2739ea65ae435e90999adb870d49f9f94dcadd88999763119edca01a6b34c25be92a80ed30db1bcacb20df40e4e7f45542bd501f059201ad578c18a11e4f5cd592cb25d6c31a054409caa99f11b6d2391440e9c72611ea";

let chartInstance = null;

document.getElementById("btnCargar").addEventListener("click", () => {
  document.getElementById("formulario").style.display = "block";
  document.querySelector(".subtitulo").style.display = "block";
  document.getElementById("resultado").innerHTML = "";
  hideChart();
});

document.getElementById("btnBuscar").addEventListener("click", buscarDirector);
document.getElementById("btnVisualizar").addEventListener("click", visualizarDatos);

function hideChart() {
  const cont = document.getElementById("graficoSeries");
  cont.style.display = "none";
  if (chartInstance) {
    chartInstance.destroy();
    chartInstance = null;
  }
}

async function buscarDirector() {
  const nombre = document.getElementById("directorInput").value.trim();
  if (!nombre) {
    alert("Ingresa un nombre.");
    return;
  }

  try {
    const res1 = await fetch(
      `https://api.themoviedb.org/3/search/person?api_key=${apiKey}&query=${encodeURIComponent(nombre)}`
    );
    const data1 = await res1.json();
    const id = data1.results?.[0]?.id;
    if (!id) {
      alert("Director no encontrado.");
      return;
    }

    const res2 = await fetch(
      `https://api.themoviedb.org/3/person/${id}/movie_credits?api_key=${apiKey}`
    );
    const data2 = await res2.json();
    const pelis = data2.crew
      .filter((p) => p.job === "Director" && p.vote_average > 0)
      .map((p) => ({ titulo: p.title, voto: p.vote_average }));

    if (pelis.length === 0) {
      alert("No dirige películas con votos.");
      return;
    }

    const suma = pelis.reduce((a, p) => a + p.voto, 0);
    const promedio = (suma / pelis.length).toFixed(2);

    const cont = document.getElementById("resultado");
    cont.innerHTML = `<div class="card">
      <h3>Promedio de votación</h3>
      <p>Director: <strong>${nombre}</strong></p>
      <p>Promedio: <strong>${promedio}</strong></p>
    </div>`;
    pelis.forEach((p) => {
      const div = document.createElement("div");
      div.className = "card";
      div.innerHTML = `<h3>${p.titulo}</h3><p>Voto: ${p.voto}</p>`;
      cont.appendChild(div);
    });

    showChart(nombre, promedio);

    // GUARDAR DIRECTOR EN STRAPI
    const resDirector = await fetch(strapiDirectorURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        data: {
          Nombre: nombre,
          Promedio: parseFloat(promedio)
        }
      })
    });

    const directorData = await resDirector.json();

    if (!resDirector.ok || !directorData.data) {
      console.error("Error al guardar director:", directorData);
      alert("No se pudo guardar el director en Strapi.");
      return;
    }

    const directorId = directorData.data.id;

    // GUARDAR CADA PELÍCULA EN STRAPI
    for (const p of pelis) {
      const peliRes = await fetch(strapiPeliURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          data: {
            Titulo: p.titulo,
            Voto: p.voto,
            g_32_director: directorId
          }
        })
      });

      if (!peliRes.ok) {
        const error = await peliRes.json();
        console.error(`Error al guardar película "${p.titulo}":`, error);
      }
    }
  } catch (e) {
    alert("Error al buscar o guardar datos: " + e.message);
  }
}

function showChart(nombre, promedio) {
  // 1) Mostramos el contenedor
  const cont = document.getElementById("graficoSeries");
  cont.style.display = "block";

  // 2) Reemplazamos el canvas por uno limpio
  cont.innerHTML = '<canvas id="grafico"></canvas>';

  // 3) Destruimos la instancia previa (si existe)
  if (chartInstance) {
    chartInstance.destroy();
    chartInstance = null;
  }

  // 4) Creamos el nuevo gráfico
  const ctx = document.getElementById("grafico").getContext("2d");
  chartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels: [nombre],               // una sola etiqueta
      datasets: [{
        label: "Promedio de Votación",
        data: [parseFloat(promedio)]   // un solo valor numérico
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true, max: 10 }
      }
    }
  });
}


async function visualizarDatos() {
  document.getElementById("formulario").style.display = "none";
  document.querySelector(".subtitulo").style.display = "none";
  document.getElementById("resultado").innerHTML = "";
  hideChart();

  try {
    const res = await fetch(`${strapiDirectorURL}?populate=*`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();

    console.log("Respuesta completa de Strapi:", data);

    if (!data.data?.length) {
      document.getElementById("resultado").innerHTML = "<p>No hay directores guardados.</p>";
      return;
    }

    // Evitar duplicados por nombre
    const nombresMostrados = new Set();

    data.data.forEach(d => {
      const attrs = d.attributes ?? d;
      const nombre   = attrs.nombre   ?? attrs.Nombre   ?? "—";
      const promedio = attrs.promedio ?? attrs.Promedio ?? "—";

      if (nombresMostrados.has(nombre)) return; // ya lo mostramos antes
      nombresMostrados.add(nombre);

      const div = document.createElement("div");
      div.className = "card";
      div.innerHTML = `<h3>${nombre}</h3><p>Promedio: ${promedio}</p>`;
      document.getElementById("resultado").appendChild(div);
    });

  } catch (e) {
    document.getElementById("resultado").innerHTML = `<p>Error: ${e.message}</p>`;
  }
}
