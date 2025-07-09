const API_KEY = "c5ab6b1f5f4c1cefbc5757bc8c0b362b"; 
const STRAPI_URL = "https://gestionweb.frlp.utn.edu.ar/api/g14-peliculas";

let generoLookup = {};

async function obtenerGeneros() {
  const res = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=es-AR`);
  const data = await res.json();
  data.genres.forEach(g => {
    generoLookup[g.id] = g.name;
  });
}

async function cargarAPI() {
  const contenedor = document.getElementById("contenido");
  contenedor.innerHTML = "<p>Cargando datos...</p>";

  try {
    await obtenerGeneros();

    console.log("Géneros cargados:", generoLookup);

    const url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&region=AR&sort_by=vote_count.desc&vote_count.gte=1000&language=es-AR&page=1`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error('Error al obtener datos de The Movie DB');
    }
    const data = await res.json();
    const top10 = data.results.slice(0, 10);

    contenedor.innerHTML = "<p>Guardando datos en Strapi...</p>";

    let uploadsExitosos = 0;
    for (const peli of top10) {
      const generos = peli.genre_ids.map(id => generoLookup[id]).join(", ");

      try {
        const resStrapi = await fetch(STRAPI_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            data: {
              titulo: peli.title,
              sinopsis: peli.overview,
              generos: generos,
              cantidad_votos: peli.vote_count,
              promedio_votos: peli.vote_average
            }
          })
        });

        if (resStrapi.ok) {
          uploadsExitosos++;
        } else {
          console.error("Error al guardar película en Strapi:", await resStrapi.text());
        }
      } catch (error) {
        console.error("Error de red al contactar Strapi:", error);
      }
    }

    if (uploadsExitosos === top10.length) {
      contenedor.innerHTML = `<p>✔ Los datos se guardaron correctamente en Strapi.</p>`;
    } else if (uploadsExitosos > 0) {
      contenedor.innerHTML = `<p>⚠ Se guardaron ${uploadsExitosos} de ${top10.length} películas. Revise la consola para más detalles.</p>`;
    } else {
      contenedor.innerHTML = `<p>❌ No se pudo guardar ninguna película en Strapi. Revise la consola para más detalles.</p>`;
    }
  } catch (error) {
    console.error("Error en cargarAPI:", error);
    contenedor.innerHTML = `<p>❌ ${error.message}.</p>`;
  }
}

async function verDatos() {
  const contenedor = document.getElementById("contenido");
  contenedor.innerHTML = "<p>Cargando datos guardados...</p>";

  try {
    const res = await fetch(STRAPI_URL);
    if (!res.ok) {
      throw new Error(`Error al contactar a Strapi: ${res.statusText}`);
    }

    const data = await res.json();

    if (!data || !Array.isArray(data.data)) {
      throw new Error("La respuesta de Strapi no es una colección válida.");
    }
    
    if (data.data.length === 0) {
      contenedor.innerHTML = "<p>No se encontraron datos en Strapi. Puede que necesites cargarlos primero.</p>";
      return;
    }

    contenedor.innerHTML = ""; // Clear "Cargando..."
    data.data.forEach(peli => {
      const attrs = peli.attributes;

      contenedor.innerHTML += `
      <div class="card">
        <h3>${attrs.titulo}</h3>
        <p><strong>Géneros:</strong> ${attrs.generos}</p>
        <p><strong>Sinopsis:</strong> ${attrs.sinopsis}</p>
        <p><strong>Votos:</strong> ${attrs.cantidad_votos}</p>
        <p><strong>Promedio:</strong> ${attrs.promedio_votos}</p>
      </div>
    `;
    });
  } catch (error) {
    console.error("Error en verDatos:", error);
    contenedor.innerHTML = `<p>❌ Error al mostrar los datos: ${error.message}</p>`;
  }
}
