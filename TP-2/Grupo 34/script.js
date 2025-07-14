// Tokens y configuración inicial
const tmdbToken = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4ZDIwZTU1ZjFkNjY5NGExMzhjODUyZWIyZGU0NzdiYyIsIm5iZiI6MTc1MTczODk4NC4yMjU5OTk4LCJzdWIiOiI2ODY5NmE2OGRjNjFkM2JmOTY1M2Y2OTkiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.-rq4PSyWpmy5XjeQmo0NunVmLP-Xq7ztAekvjkki6Ws";
const strapiToken = "099da4cc6cbb36bf7af8de6f1f241f8c81e49fce15709c4cfcae1313090fa2c1ac8703b0179863b4eb2739ea65ae435e90999adb870d49f9f94dcadd88999763119edca01a6b34c25be92a80ed30db1bcacb20df40e4e7f45542bd501f059201ad578c18a11e4f5cd592cb25d6c31a054409caa99f11b6d2391440e9c72611ea";
const strapiBaseUrl = "https://gestionweb.frlp.utn.edu.ar/api/g34-peliculas";
const franquicias = ["Cinemax", "Cinepolis", "Hoyts"];

// Obtener películas de TMDB
async function obtenerPeliculasTMDB() {
  const res = await fetch("https://api.themoviedb.org/3/movie/now_playing?language=es-ES&page=1", {
    headers: {
      Authorization: `Bearer ${tmdbToken}`,
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();
  return data.results;
}

// Guardar en Strapi
async function guardarPeliculasEnStrapi(peliculas) {
  for (const pelicula of peliculas) {
    const franquiciaRandom = franquicias[Math.floor(Math.random() * franquicias.length)];
    const payload = {
      data: {
        titulo: pelicula.title,
        descripcion: pelicula.overview,
        cartel: `https://image.tmdb.org/t/p/w500${pelicula.poster_path}`,
        fecha_estreno: pelicula.release_date,
        franquicia: franquiciaRandom,
      },
    };
    console.log(`→ Asignando: ${pelicula.title} a ${franquiciaRandom}`);

    const response = await fetch(strapiBaseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${strapiToken}`,
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      console.error(`❌ No se pudo guardar ${pelicula.title}:`, await response.text());
    } else {
      const resJson = await response.json();
      console.log(`✅ Guardada: ${pelicula.title}`, resJson);
    }
  }
}

// Mostrar datos desde Strapi
async function mostrarPeliculasYFranquiciaTop() {
  try {
    const res = await fetch(strapiBaseUrl, {
      headers: {
        Authorization: `Bearer ${strapiToken}`,
      },
    });

    const data = await res.json();

    if (!data || !data.data) {
      throw new Error("Respuesta inválida de Strapi");
    }

    const contenedor = document.getElementById("contenido");
    contenedor.innerHTML = "<h2>Películas en cartelera</h2>";

    const contador = {};

    data.data.forEach((pelicula) => {
      console.log(`Película: ${pelicula.titulo}, Franquicia: ${pelicula.franquicia}`);
      const info = pelicula;

      // Verificamos que exista info y todos los campos
      if (!info || !info.titulo || !info.franquicia) return;

      contenedor.innerHTML += `
        <div style="margin-bottom: 20px; border-bottom: 1px solid #ddd; padding-bottom: 10px;">
            <h3>${info.titulo}</h3>
            <img src="${info.cartel}" width="150" id="imagencart"/>
            <p>${info.descripcion}</p>
            <p><strong>Franquicia:</strong> ${info.franquicia}</p>
            <p><strong>Estreno:</strong> ${info.fecha_estreno}</p>
        </div>
        `;

      const f = info.franquicia;
      contador[f] = (contador[f] || 0) + 1;
    });

    if (Object.keys(contador).length === 0) {
      contenedor.innerHTML += `<p style="color:red;">❌ No hay películas cargadas en Strapi.</p>`;
      return;
    }

    const franquiciaTop = Object.entries(contador).sort((a, b) => b[1] - a[1])[0];
    contenedor.innerHTML += `
      <div style="margin-top: 30px; background: #f0f0f0; padding: 15px; border-radius: 10px;">
        <h3>🎬 Franquicia con más películas: ${franquiciaTop[0]}</h3>
        <p>Total: ${franquiciaTop[1]} películas</p>
      </div>
    `;

    // Después de mostrar la franquicia top, agregamos el canvas para Chart.js
    const canvasId = "graficoFranquicias";

    // Crear un contenedor para el gráfico
    contenedor.innerHTML += `
      <div style="margin-top: 40px; padding: 20px; background: #fff; border-radius: 10px; box-shadow: 0 0 8px #ccc; max-width: 300px;">
        <h3>📊 Distribución de películas por franquicia</h3>
        <canvas id="${canvasId}"></canvas>
        <ul id="listaFranquicias" style="list-style:none; padding:0; margin-top: 20px;"></ul>
      </div>
    `;

    // Crear el gráfico de torta
    const ctx = document.getElementById(canvasId).getContext("2d");

    new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: Object.keys(contador),
        datasets: [{
          label: "Cantidad de películas",
          data: Object.values(contador),
          backgroundColor: [
            "#007bff", // Azul
            "#28a745", // Verde
            "#dc3545", // Rojo
          ],
          borderColor: "#fff",
          borderWidth: 2,
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "bottom"
          },
          tooltip: {
            callbacks: {
              label: context => `${context.label}: ${context.parsed} películas`
            }
          }
        }
      }
    });

    // Mostrar lista con cantidad por franquicia debajo del gráfico
    const lista = document.getElementById("listaFranquicias");
    Object.entries(contador).forEach(([franquicia, cantidad]) => {
      const li = document.createElement("li");
      li.textContent = `🎬 ${franquicia}: ${cantidad} películas`;
      lista.appendChild(li);
    });

  } catch (error) {
    console.error("❌ Error al mostrar películas y franquicia:", error);
    alert("Hubo un error al mostrar los datos. Revisá la consola.");
  }
}

// ✅ NUEVO: Función reutilizable para desactivar botón, mostrar loader y ejecutar acción async
async function ejecutarConCarga(botonId, accionAsync, mensajeAlFinal = null) {
  const boton = document.getElementById(botonId);
  const loader = boton.querySelector(".loader");

  // Desactivar botón y mostrar loader animado
  boton.disabled = true;
  boton.classList.add("loading");
  if (loader) loader.style.display = "inline-block";

  try {
    await accionAsync();
    if (mensajeAlFinal) alert(mensajeAlFinal);
  } catch (err) {
    console.error("❌ Error:", err);
    alert("Hubo un error. Revisá la consola.");
  } finally {
    // Reactivar botón y ocultar loader
    boton.disabled = false;
    boton.classList.remove("loading");
    if (loader) loader.style.display = "none";
  }
}

// Eventos al presionar botones con efecto de carga
document.getElementById("cargarDatos").addEventListener("click", async () => {
  await ejecutarConCarga("cargarDatos", async () => {
    const peliculas = await obtenerPeliculasTMDB();
    await guardarPeliculasEnStrapi(peliculas);
  }, "✅ Películas cargadas en Strapi correctamente.");
});

document.getElementById("verDatos").addEventListener("click", async () => {
  await ejecutarConCarga("verDatos", mostrarPeliculasYFranquiciaTop);
});
