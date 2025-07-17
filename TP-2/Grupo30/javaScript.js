const API_KEY = 'a5d4e0ae76bfabaab8a130237224bcda';
const BASE_URL = 'https://api.themoviedb.org/3';
const STRAPI_URL_PELICULAS = 'https://gestionweb.frlp.utn.edu.ar/api/g30-peliculas';
const STRAPI_TOKEN = "099da4cc6cbb36bf7af8de6f1f241f8c81e49fce15709c4cfcae1313090fa2c1ac8703b0179863b4eb2739ea65ae435e90999adb870d49f9f94dcadd88999763119edca01a6b34c25be92a80ed30db1bcacb20df40e4e7f45542bd501f059201ad578c18a11e4f5cd592cb25d6c31a054409caa99f11b6d2391440e9c72611ea";

let resultadosActores = [];

async function obtenerActoresConUltimaPelicula() {
  try {
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
        generos: JSON.stringify(detalles.genres?.map(g => g.name) || []),
      };
      resultados.push(datosActor);

      // 1) Hacer el POST y guardar la respuesta en postRes
const postRes = await fetch(STRAPI_URL_PELICULAS, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${STRAPI_TOKEN}`,
  },
  body: JSON.stringify({ data: datosActor })
});

// 2) Validar estado HTTP
if (!postRes.ok) {
  console.error('Error al guardar actor en Strapi:', postRes.status);
  continue;  // o maneja el error como necesites
}

// 3) Leer el JSON de la respuesta
const postData = await postRes.json();
console.log('Strapi devolvió:', postData);
    }

    if (resultados.length === 0) {
      div.innerText = 'No se encontraron datos.';
      return;
    }

    resultadosActores = resultados;

    div.innerHTML = resultados.map(a => `
      <div class="tarjeta-actor">
        <strong>${a.nombre} ${a.apellido}</strong><br>
        <span class="etiqueta">Película:</span> ${a.titulo}<br>
        <span class="etiqueta">Fecha de estreno:</span> ${a.fecha_estreno}<br>
        <span class="etiqueta">Votos:</span> ${a.cantidad_votos} | 
        <span class="etiqueta">Promedio:</span> ${a.promedio_votos}<br>
        <span class="etiqueta">Géneros:</span>
        <ul>${(JSON.parse(a.generos || '[]')).map(g => `<li>${g}</li>`).join('')}</ul>
      </div>
    `).join('');

  } catch (error) {
    console.error(error);
    document.getElementById('resultado').innerText = `Error: ${error.message}`;
  }
}

async function mostrarActoresDesdeStrapi() {
  try {
    const div = document.getElementById('resultado');
    div.innerText = 'Consultando Strapi...';

    const res = await fetch(`${STRAPI_URL_PELICULAS}`, {
      headers: {
      'Authorization': `Bearer ${STRAPI_TOKEN}`
      }
    });
    if (!res.ok) throw new Error('Error accediendo a Strapi.');

    const data = await res.json();
    console.log(data)
    const actores = data.data;

    if (!actores || actores.length === 0) {
      div.innerText = 'No hay datos en Strapi.';
      return;
    }

    div.innerHTML = actores.map(entry => {
      const a = entry.attributes;
      return `
        <div class="tarjeta-actor">
          <strong>${a.nombre} ${a.apellido}</strong><br>
          <span class="etiqueta">Película:</span> ${a.titulo}<br>
          <span class="etiqueta">Fecha de estreno:</span> ${a.fecha_estreno}<br>
          <span class="etiqueta">Votos:</span> ${a.cantidad_votos} | 
          <span class="etiqueta">Promedio:</span> ${a.promedio_votos}<br>
          <span class="etiqueta">Géneros:</span>
          <ul>${JSON.parse(a.generos || '[]').map(g => `<li>${g}</li>`).join('')}</ul>
        </div>
      `;
    }).join('');

  } catch (err) {
    console.error(err);
    document.getElementById('resultado').innerText = 'No se pudo acceder a Strapi.';
  }
}
