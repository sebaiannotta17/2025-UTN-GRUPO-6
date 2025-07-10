const frases = [
  "La vida es un viaje, no un destino.",
  "El conocimiento es poder.",
  "La creatividad es la inteligencia divirtiéndose.",
];

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

const STRAPI_TOKEN = '099da4cc6cbb36bf7af8de6f1f241f8c81e49fce15709c4cfcae1313090fa2c1ac8703b0179863b4eb2739ea65ae435e90999adb870d49f9f94dcadd88999763119edca01a6b34c25be92a80ed30db1bcacb20df40e4e7f45542bd501f059201ad578c18a11e4f5cd592cb25d6c31a054409caa99f11b6d2391440e9c72611ea';
async function guardarSerieEnStrapi(serie) {
  await fetch('https://gestionweb.frlp.utn.edu.ar/api/g3-series', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${STRAPI_TOKEN}`
    },
    body: JSON.stringify({
      data: {
        titulo: serie.nombre,
        sinopsis: serie.sinopsis,
        genero: serie.generos[0] || "desconocido",
        cant_votos: serie.cantidadDeVotos,
        prom_votos: serie.promedioDeVotos
      }
    })
  });
  
  if (!res.ok) {
    const msg = await res.text();
    console.error('Error al guardar serie:', res.status, msg);
    throw new Error(`Falló con status ${res.status}`);
  }
}

async function subirSeriesStrapi() {
  try {
    const series = await setMovies(); 

    for (const serie of series) {
      await guardarSerieEnStrapi(serie); 
    }

    console.log('Series cargadas correctamente en Strapi');
  } catch (error) {
    console.error('Error al cargar series:', error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const cargarDatosLink = document.querySelector('.setDatos');
  cargarDatosLink.addEventListener('click', (e) => {
      e.preventDefault();
      setMovies();
  });
});

mostrarFrase(frases);
