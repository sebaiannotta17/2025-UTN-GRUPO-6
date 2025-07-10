const API_KEY = "c5ab6b1f5f4c1cefbc5757bc8c0b362b";
const STRAPI_URL = "https://gestionweb.frlp.utn.edu.ar/api/g14pelis";
const STRAPI_GENEROS_URL = "https://gestionweb.frlp.utn.edu.ar/api/g14gens";
const STRAPI_TOKEN = "099da4cc6cbb36bf7af8de6f1f241f8c81e49fce15709c4cfcae1313090fa2c1ac8703b0179863b4eb2739ea65ae435e90999adb870d49f9f94dcadd88999763119edca01a6b34c25be92a80ed30db1bcacb20df40e4e7f45542bd501f059201ad578c18a11e4f5cd592cb25d6c31a054409caa99f11b6d2391440e9c72611ea";

let generoLookupTMDB = {};    // id TMDB -> nombre género
let generoStrapiMap = {};    // nombre género -> id Strapi

async function obtenerGenerosTMDB() {
  const res = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=es-AR`);
  const data = await res.json();
  data.genres.forEach(g => {
    generoLookupTMDB[g.id] = g.name;
  });
}

async function obtenerGenerosDeStrapi() {
  try {
    const res = await fetch(STRAPI_GENEROS_URL, {
      headers: {
        "Authorization": `Bearer ${STRAPI_TOKEN}`
      }
    });
    const data = await res.json();

    if (data && data.data && Array.isArray(data.data)) {
      data.data.forEach(g => {
        if (g.attributes && g.attributes.nombre) {
          generoStrapiMap[g.attributes.nombre] = g.id;
        } else if (g.nombre) {
          generoStrapiMap[g.nombre] = g.id;
        } else {
          console.warn('Género sin nombre válido:', g);
        }
      });
    } else {
      console.warn('Respuesta inesperada de Strapi:', data);
    }
  } catch (error) {
    console.error('Error al obtener géneros de Strapi:', error);
    throw error;
  }
}

async function crearGeneroEnStrapi(nombreGenero) {
  try {
    const res = await fetch(STRAPI_GENEROS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${STRAPI_TOKEN}`
      },
      body: JSON.stringify({
        data: {
          nombre: nombreGenero
        }
      })
    });

    if (res.ok) {
      const data = await res.json();
      generoStrapiMap[nombreGenero] = data.data.id;
      return data.data.id;
    } else {
      const errorText = await res.text();
      console.error("Error al crear género en Strapi:", errorText);
      return null;
    }
  } catch (error) {
    console.error("Error de red al crear género en Strapi:", error);
    return null;
  }
}

async function obtenerIdsGenerosStrapi(nombresGeneros) {
  const generosIDs = [];

  for (const nombre of nombresGeneros) {
    if (generoStrapiMap[nombre]) {
      generosIDs.push({ id: generoStrapiMap[nombre] });
    } else {
      const nuevoId = await crearGeneroEnStrapi(nombre);
      if (nuevoId) {
        generosIDs.push({ id: nuevoId });
      }
    }
  }

  return generosIDs;
}

async function cargarAPI() {
  const contenedor = document.getElementById("contenido");
  contenedor.innerHTML = "<p>Cargando datos...</p>";

  try {
    await obtenerGenerosTMDB();
    console.log("Géneros de TMDB cargados:", generoLookupTMDB);

    await obtenerGenerosDeStrapi();
    console.log("Géneros de Strapi cargados:", generoStrapiMap);

    const url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&region=AR&include_adult=false&sort_by=vote_count.desc&vote_count.gte=1000&language=es-AR&page=1`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Error al obtener datos de TMDB');

    const data = await res.json();
    const top10 = data.results.slice(0, 10);
    console.log("Películas obtenidas de TMDB:", top10);

    contenedor.innerHTML = "<p>Guardando datos en Strapi...</p>";

    let uploadsExitosos = 0;
    for (const peli of top10) {
      const nombresGeneros = peli.genre_ids.map(id => generoLookupTMDB[id]).filter(Boolean);
      console.log(`Procesando película: ${peli.title}`, nombresGeneros);

      const generosIDs = await obtenerIdsGenerosStrapi(nombresGeneros);
      console.log(`IDs de géneros para ${peli.title}:`, generosIDs);

      try {
        const resStrapi = await fetch(STRAPI_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${STRAPI_TOKEN}`
          },
          body: JSON.stringify({
            data: {
              Titulo: peli.title,
              Sinopsis: peli.overview,
              g_14_gens: generosIDs,
              Cantidad_votos: peli.vote_count,
              Promedio_votos: peli.vote_average
            }
          })
        });

        if (resStrapi.ok) {
          const peliculaCreada = await resStrapi.json();
          console.log(`Película guardada: ${peli.title}`, peliculaCreada);
          uploadsExitosos++;
        } else {
          const error = await resStrapi.text();
          console.error(`Error al guardar ${peli.title}:`, error);
        }
      } catch (error) {
        console.error(`Error de red con ${peli.title}:`, error);
      }
    }

    if (uploadsExitosos === top10.length) {
      contenedor.innerHTML = `<p>✔ Todas las películas se guardaron correctamente</p>`;
    } else if (uploadsExitosos > 0) {
      contenedor.innerHTML = `<p>⚠ Se guardaron ${uploadsExitosos} de ${top10.length} películas</p>`;
    } else {
      contenedor.innerHTML = `<p>❌ No se pudo guardar ninguna película</p>`;
    }

  } catch (error) {
    console.error("Error en cargarAPI:", error);
    contenedor.innerHTML = `<p>❌ Error: ${error.message}</p>`;
  }
}

async function verDatos() {
  const contenedor = document.getElementById("contenido");
  contenedor.innerHTML = "<p>Cargando datos guardados...</p>";

  try {
    const res = await fetch(`${STRAPI_URL}?populate=g_14_gens&pagination[limit]=10`, {
      headers: {
        "Authorization": `Bearer ${STRAPI_TOKEN}`
      }
    });

    if (!res.ok) {
      throw new Error(`Error ${res.status}: ${await res.text()}`);
    }

    const response = await res.json();
    console.log("Respuesta de Strapi:", response);

    if (!response.data || !Array.isArray(response.data)) {
      throw new Error("Estructura de datos inválida");
    }

    contenedor.innerHTML = response.data.map(pelicula => {
      const attributes = pelicula.attributes || pelicula;

      const titulo = attributes?.Titulo || "Sin título";
      const sinopsis = attributes?.Sinopsis || "Sin sinopsis disponible";
      const votos = attributes?.Cantidad_votos ?? "N/A";
      const promedio = attributes?.Promedio_votos?.toFixed(1) ?? "N/A";

      const generos = attributes?.g_14_gens?.data?.length > 0
        ? attributes.g_14_gens.data.map(g => g.attributes?.nombre).join(", ")
        : "⚠ No se cargaron los géneros";

      return `
        <div class="card" style="
          margin: 1rem;
          padding: 1.5rem;
          border: 1px solid #ddd;
          border-radius: 8px;
          background: white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        ">
          <h3 style="margin-top: 0; color: #333;">${titulo}</h3>
          <p><strong style="color: #555;">Géneros:</strong> ${generos}</p>
          <p><strong style="color: #555;">Sinopsis:</strong> ${sinopsis}</p>
          <p><strong style="color: #555;">Votos:</strong> ${votos}</p>
          <p><strong style="color: #555;">Promedio:</strong> ${promedio}</p>
        </div>
      `;
    }).join("");

  } catch (error) {
    console.error("Error en verDatos:", error);
    contenedor.innerHTML = `
      <div style="
        color: #721c24;
        background-color: #f8d7da;
        border: 1px solid #f5c6cb;
        padding: 1rem;
        border-radius: 4px;
      ">
        <p><strong>Error:</strong> ${error.message}</p>
        <p>Revisá la consola para más detalles</p>
      </div>
    `;
  }
}