const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmOTExOGIwNTExMWU3NDJjZWZjMTg1ZDFmMmE2YzU0OCIsIm5iZiI6MTc1MjAxOTkzMS43ODksInN1YiI6IjY4NmRiM2RiZjNmZTNjZjVjYjZlOGI3ZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.gLNmS_yK_uyB7unQUnAnPFCABpx1X9ey2l0nLVzsA0E'
  }
};


// fetch('https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=es&page=1&sort_by=popularity.desc', options)
//   .then(res => res.json())
//   .then(res => console.log(res))
//   .catch(err => console.error(err));

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
      descripcion: peli.overview
    }
  };

  await fetch("https://gestionweb.frlp.utn.edu.ar/api/peliculas", {
    method: "POST",
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmOTExOGIwNTExMWU3NDJjZWZjMTg1ZDFmMmE2YzU0OCIsIm5iZiI6MTc1MjAxOTkzMS43ODksInN1YiI6IjY4NmRiM2RiZjNmZTNjZjVjYjZlOGI3ZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.gLNmS_yK_uyB7unQUnAnPFCABpx1X9ey2l0nLVzsA0E'
    },
    body: JSON.stringify(pelicula)
  });
}

}
async function visualizarDatos(){
  const res = await fetch("https://gestionweb.frlp.utn.edu.ar/api/peliculas?sort[0]=popularidad:desc");
  const data = await res.json();

  for (let peli of data.data) {
    document.body.innerHTML += `
      <div>
        <h2>${peli.attributes.titulo}</h2>
        <img src="${peli.attributes.poster_url}" width="200">
        <p>${peli.attributes.descripcion}</p>
        <p>Popularidad: ${peli.attributes.popularidad}</p>
      </div>
    `;
  }


}