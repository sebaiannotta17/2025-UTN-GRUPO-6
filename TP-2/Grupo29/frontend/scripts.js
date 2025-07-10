const API_KEY = "099da4cc6cbb36bf7af8de6f1f241f8c81e49fce15709c4cfcae1313090fa2c1ac8703b0179863b4eb2739ea65ae435e90999adb870d49f9f94dcadd88999763119edca01a6b34c25be92a80ed30db1bcacb20df40e4e7f45542bd501f059201ad578c18a11e4f5cd592cb25d6c31a054409caa99f11b6d2391440e9c72611ea"; 
const BEARER_TOKEN = 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmOTExOGIwNTExMWU3NDJjZWZjMTg1ZDFmMmE2YzU0OCIsIm5iZiI6MTc1MjAxOTkzMS43ODksInN1YiI6IjY4NmRiM2RiZjNmZTNjZjVjYjZlOGI3ZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.gLNmS_yK_uyB7unQUnAnPFCABpx1X9ey2l0nLVzsA0E';
const STRAPI_URL = "https://gestionweb.frlp.utn.edu.ar/api/g29-peliculas";
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: BEARER_TOKEN
  }
};



async function buscarPeliculas() {
  const desde = document.getElementById("fechaInicio").value;
  const hasta = document.getElementById("fechaFin").value;
  const popularidad = document.getElementById("popularidad").value;

  const url = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=es&page=1&primary_release_date.gte=${desde}&primary_release_date.lte=${hasta}&sort_by=popularity.${popularidad}`;

  const res = await fetch(url, options);
  const data = await res.json();

  console.log(data.results); // Acá están las películas

  for (let peli of data.results) {
  const pelicula = {
    data: {
      titulo: peli.title,
      fecha_estreno: peli.release_date,
      popularidad: peli.popularity,
      descripcion: peli.overview,
      image: peli.poster_path,

    }
  };

  await fetch(`${STRAPI_URL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify(pelicula)
  });
  }

}


async function visualizarDatos(){
  const res = await fetch(`${STRAPI_URL}`,{
    method: "GET",
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${API_KEY}`,
    }
  });

  const data = await res.json();
  console.log(data.data); // Acá están los datos de Strapi
  document.getElementById("resultados").innerHTML = ""; // limpiar
  for (let peli of data.data) {
    document.getElementById("resultados").innerHTML += `
      <div class="card" style="width: 18rem;">
        <img src="${IMAGE_BASE_URL}${peli.image}" class="card-img-top" alt="...">
        <div class="card-body">
          <p>Popularidad: ${peli.popularidad}</p>
          <p>Fecha de estreno: ${peli.fecha_estreno}</p>
          <h5 class="card-title">${peli.titulo}</h5>
          <p class="card-text">${peli.descripcion}</p>
        </div>
        
      </div>
    `;
  }

}



async function limpiarStrapi() {
    console.log("Iniciando limpieza de datos en Strapi...");
    try {
        const response = await fetch(STRAPI_URL, {
            headers: { "Authorization": `Bearer ${API_KEY}` }
        });

        if (!response.ok) throw new Error("No se pudo obtener la lista de items para eliminar.");

        const { data } = await response.json();

        if (!data || data.length === 0) {
            console.log("No hay datos en Strapi para eliminar.");
            return;
        }

        const deletePromises = data.map(item =>
            fetch(`${STRAPI_URL}/${item.documentId}`, {
                method: 'DELETE',
                headers: { "Authorization": `Bearer ${API_KEY}` }
            })
        );

        await Promise.all(deletePromises);
        console.log("Todos los datos en Strapi han sido eliminados exitosamente.");
    } catch (error) {
        console.error("Error durante el proceso de limpieza de Strapi:", error);
    }
}