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

    await fetch(strapiBaseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${strapiToken}`,
      },
      body: JSON.stringify(payload),
    });
  }

  alert("✅ Películas cargadas en Strapi correctamente.");
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
    const info = pelicula.attributes;

    // Verificamos que exista info y todos los campos
    if (!info || !info.titulo || !info.franquicia) return;

     contenedor.innerHTML += `
        <div style="margin-bottom: 20px; border-bottom: 1px solid #ddd; padding-bottom: 10px;">
            <h3>${info.titulo}</h3>
            <img src="${info.cartel}" width="150"/>
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
  } catch (error) {
    console.error("❌ Error al mostrar películas y franquicia:", error);
    alert("Hubo un error al mostrar los datos. Revisá la consola.");
  }
}



// Eventos al presionar botones
document.getElementById("cargarDatos").addEventListener("click", async () => {
  const peliculas = await obtenerPeliculasTMDB();
  await guardarPeliculasEnStrapi(peliculas);
});

document.getElementById("verDatos").addEventListener("click", mostrarPeliculasYFranquiciaTop);
