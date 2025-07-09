const API_KEY = '5e393a2965ef1b88e2dd5d6ea8bf1301';

async function obtenerPeliculaAleatoria() {
  try {
    // lista de peliculas en español
    const res = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=es-ES&page=1`);
    const data = await res.json();

    // pelicula aleatoria
    const peliculas = data.results;
    const pelicula = peliculas[Math.floor(Math.random() * peliculas.length)];

    // detalles pelicula
    const resDetalles = await fetch(`https://api.themoviedb.org/3/movie/${pelicula.id}?api_key=${API_KEY}&language=es-ES`);
    const detalles = await resDetalles.json();

    // insertar en el HTML
    document.getElementById('titulo-pelicula').textContent = detalles.title;
    document.getElementById('sinopsis-pelicula').textContent = detalles.overview;
    document.getElementById('duracion-pelicula').innerHTML = `<strong>Duración:</strong> ${detalles.runtime} minutos`;

    // generos
    const generos = detalles.genres.map(g => g.name).join(', ');
    document.getElementById('generos-pelicula').innerHTML = `<strong>Género(s):</strong> ${generos}`;

    // imagen de portada
    if (detalles.poster_path) {
      const urlImagen = `https://image.tmdb.org/t/p/w500${detalles.poster_path}`;
      const imgElem = document.getElementById('portada-pelicula');
      imgElem.src = urlImagen;
      imgElem.style.display = 'block';
    }

  } catch (error) {
    console.error("Error al obtener datos de peliculas:", error);
    document.getElementById('titulo-pelicula').textContent = "No se pudo cargar la pelicula";
  }
}

obtenerPeliculaAleatoria();
