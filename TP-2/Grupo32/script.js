const apiKey = "7a0da2a763bb92d8230a59dab03bd601";
const strapiDirectorURL = "https://gestionweb.frlp.utn.edu.ar/api/g32-directors";
const strapiPeliURL = "https://gestionweb.frlp.utn.edu.ar/api/g32-peliculas";
const token =
  "099da4cc6cbb36bf7af8de6f1f241f8c81e49fce15709c4cfcae1313090fa2c1ac8703b0179863b4eb2739ea65ae435e90999adb870d49f9f94dcadd88999763119edca01a6b34c25be92a80ed30db1bcacb20df40e4e7f45542bd501f059201ad578c18a11e4f5cd592cb25d6c31a054409caa99f11b6d2391440e9c72611ea";

let chartInstance = null;

// Mostrar formulario
document.getElementById("btnCargar").addEventListener("click", () => {
  document.getElementById("formulario").style.display = "block";
  document.querySelector(".subtitulo").style.display = "block";  // <-- Aquí muestro el subtítulo cuando cargo datos
  document.getElementById("resultado").innerHTML = "";
  hideChart();
});

// Buscar y calcular promedio
document.getElementById("btnBuscar").addEventListener("click", buscarDirector);

// Visualizar datos guardados
document.getElementById("btnVisualizar").addEventListener("click", visualizarDatos);

// Oculta el gráfico y destruye instancia previa
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
  if (!nombre) return alert("Ingresa un nombre.");

  // 1) Obtener ID de TMDB
  const res1 = await fetch(
    `https://api.themoviedb.org/3/search/person?api_key=${apiKey}&query=${encodeURIComponent(
      nombre
    )}`
  );
  const data1 = await res1.json();
  const id = data1.results?.[0]?.id;
  if (!id) return alert("Director no encontrado.");

  // 2) Obtener créditos de película
  const res2 = await fetch(
    `https://api.themoviedb.org/3/person/${id}/movie_credits?api_key=${apiKey}`
  );
  const data2 = await res2.json();
  const pelis = data2.crew
    .filter((p) => p.job === "Director" && p.vote_average > 0)
    .map((p) => ({ titulo: p.title, voto: p.vote_average }));

  if (pelis.length === 0) return alert("No dirige películas con votos.");

  // 3) Calcular promedio
  const suma = pelis.reduce((a, p) => a + p.voto, 0);
  const promedio = (suma / pelis.length).toFixed(2);

  // 4) Mostrar resultados
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

  // 5) Gráfico
  showChart(pelis);

  // 6) Guardar en Strapi
  await fetch(strapiDirectorURL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ data: { Nombre: nombre, Promedio: parseFloat(promedio) } }),
  });
  for (const p of pelis) {
    await fetch(strapiPeliURL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ data: { Nombre: p.titulo, Voto: p.voto } }),
    });
  }
}

function showChart(pelis) {
  document.getElementById("graficoSeries").style.display = "block";
  const ctx = document.getElementById("grafico").getContext("2d");
  if (chartInstance) chartInstance.destroy();
  chartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels: pelis.map((p) => p.titulo),
      datasets: [
        {
          label: "Votación",
          data: pelis.map((p) => p.voto),
          backgroundColor: "rgba(33,150,243,0.6)",
        },
      ],
    },
    options: {
      responsive: true,
      scales: { y: { beginAtZero: true, max: 10 } },
    },
  });
}

async function visualizarDatos() {
  // Ocultar formulario y subtítulo
  document.getElementById("formulario").style.display = "none";
  document.querySelector(".subtitulo").style.display = "none";  // <-- Aquí oculto el subtítulo al visualizar datos

  document.getElementById("resultado").innerHTML = "";
  hideChart();

  try {
    const res = await fetch(`${strapiDirectorURL}?populate=*`);
    const data = await res.json();
    if (!data.data?.length)
      return (document.getElementById("resultado").innerHTML = "<p>No hay directores guardados.</p>");

    data.data.forEach((d) => {
      const div = document.createElement("div");
      div.className = "card";
      div.innerHTML = `<h3>${d.attributes.Nombre}</h3><p>Promedio: ${d.attributes.Promedio}</p>`;
      document.getElementById("resultado").appendChild(div);
    });
  } catch (e) {
    document.getElementById("resultado").innerHTML = `<p>Error: ${e.message}</p>`;
  }
}
