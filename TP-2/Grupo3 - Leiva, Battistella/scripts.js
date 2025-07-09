function mostrarFrase(frases) {
  const divPrin = document.querySelector(".contenido_principal");
  divPrin.classList.add("oculto");

  const numero = Math.floor(Math.random() * frases.length);

  let fraseSeleccion = frases[numero];
  let frase = document.getElementById("frase");
  frase.innerHTML = fraseSeleccion;
}

function formatearEstructura() {
  document.querySelector(".pagina_inicio").style.display = "none";
  const divPrin = document.querySelector(".contenido_principal");
  divPrin.classList.add("activo");
  divPrin.innerHTML = "";
}


async function setMovies() {
  const urlPeliculas = 'https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&primary_release_date.gte=2020-01-01';
  const urlGeneros = 'https://api.themoviedb.org/3/genre/movie/list?language=en';

  const options = {
      method: 'GET',
      headers: {
          accept: 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmMzM3NmExMzMwMjQyZWU0ZTExMDhhZDAyY2EwNWYzNSIsIm5iZiI6MTc0NTYwODEwOS4wMDEsInN1YiI6IjY4MGJkZGFjMjcxZWNiM2FlMDhhOTJlYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.8bncoI2ht26BFDcIEoOEhsoE_6QcwObIpcWptj96MCQ'
      }
  };

  try {
    //Llamo a la API de peliculas
    const responsePeliculas = await fetch(urlPeliculas, options);
    const responseGeneros = await fetch(urlGeneros, options);
    
    //Convierto lo que me devolvio a objetos JSON porque lo que me devuelve es un texto plano
    const dataPeliculas = await responsePeliculas.json();
    const dataGeneros = await responseGeneros.json();

    //Creo un objeto genero que me permitira identificar los generos de una peliculas mas adelante
    let generos = {}
    dataGeneros.genres.forEach(g => {
      generos[g.id] = g.name
    });

    let listaPeliculas = dataPeliculas.results.splice(0,10).map(p => ({ //Con el splice agarramos los primeros 10, con el map guardamos lo que se nos pidio de las peliculas en listaPeliculas
      nombre: p.title,
      sinopsis: p.overview,
      generos: p.genre_ids.map(id => generos[id] || "desconocido"), //Dentro del objeto generos veremos que id coinciden con los id guardados en las peliculas
      cantidadDeVotos: p.vote_count,
      promedioDeVotos: p.vote_average
    }));
    
    return listaPeliculas;
  } catch (error) {
      console.error('Error al cargar datos:', error);
  }
}

const frases = [
  "La vida es un viaje, no un destino.",
  "El conocimiento es poder.",
  "La creatividad es la inteligencia divirtiéndose.",
];

document.addEventListener('DOMContentLoaded', () => {
  const cargarDatosLink = document.querySelector('.setDatos');
  cargarDatosLink.addEventListener('click', (e) => {
      e.preventDefault();
      setMovies();
  });
});


mostrarFrase(frases);
