const API_KEY = 'be1c03d69517ac3ed92e7c31c6f505cc';
const API_URL = 'https://api.themoviedb.org/3';

async function getGenres() {
    const res = await fetch(`${API_URL}/genre/tv/list?api_key=${API_KEY}&language=es`);
    const data = await res.json();
    return data.genres;
}

async function getOldestTVShows() {
    let page = 1;
    let results = [];

    while (results.length < 10 && page <= 50) {
        const res = await fetch(`${API_URL}/discover/tv?api_key=${API_KEY}&language=es&sort_by=first_air_date.asc&include_adult=false&include_null_first_air_dates=false&page=${page}`);
        const data = await res.json();

        const filtered = data.results.filter(tv => tv.first_air_date);
        results = results.concat(filtered);

        page++;
    }

    return results.slice(0, 10);
}

async function getTVShowDetails(tvId) {
    const res = await fetch(`${API_URL}/tv/${tvId}?api_key=${API_KEY}&language=es`);
    return await res.json();
}


async function subirSerieAStrapi(serie) {
    await fetch('https://gestionweb.frlp.utn.edu.ar/api/serie-grupo15', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            data: {
                titulo: serie.titulo,
                sinopsis: serie.sinopsis,
                generos: serie.generos.join(', '),
                popularidad: serie.popularidad,
                pais_origen: serie.pais_origen,
            }
        })
    });
}
async function cargarSeries() {
    const genresList = await getGenres();
    const shows = await getOldestTVShows();
    const lista = document.getElementById('listaSeries');
    lista.innerHTML = ''; // Limpiar contenido anterior

    for (const show of shows) {
        const details = await getTVShowDetails(show.id);

        const showData = {
            id: show.id, // Añadir el ID para poder buscar detalles completos más tarde
            titulo: show.name,
            sinopsis: show.overview,
            generos: show.genre_ids.map(id => {
                const genre = genresList.find(g => g.id === id);
                return genre ? genre.name : 'Desconocido';
            }),
            popularidad: show.popularity,
            pais_origen: details.origin_country.join(', ') || 'Desconocido',
            // Añadir más detalles para el modal
            fecha_estreno: show.first_air_date || 'Desconocida',
            votos_promedio: show.vote_average || 'N/A'
             
        };
        subirSerieAStrapi(showData);

        const item = document.createElement('div');
        // Usar data-attributes para almacenar la información completa para el modal
        item.dataset.id = showData.id;
        item.dataset.titulo = showData.titulo;
        item.dataset.sinopsis = showData.sinopsis;
        item.dataset.generos = showData.generos.join(', ');
        item.dataset.popularidad = showData.popularidad;
        item.dataset.paisOrigen = showData.pais_origen;
        item.dataset.fechaEstreno = showData.fecha_estreno;
        item.dataset.votosPromedio = showData.votos_promedio;


        item.innerHTML = `
            <h4>${showData.titulo}</h4>
            <p><strong>Sinopsis:</strong> ${showData.sinopsis || 'Sin sinopsis'}</p>
            <p><strong>Género:</strong> ${showData.generos.join(', ') || 'Sin género'}</p>
            <p><strong>Popularidad:</strong> ${showData.popularidad}</p>
            <p><strong>País de origen:</strong> ${showData.pais_origen}</p>
        `;

        // Añadir evento de clic a cada tarjeta
        item.addEventListener('click', function() {
            mostrarDetallesModal(this.dataset); // Pasamos todos los data-attributes
        });

        lista.appendChild(item);

    }
}

// Función para mostrar el modal con los detalles
function mostrarDetallesModal(data) {
    const modal = document.getElementById('modalSerie');
    document.getElementById('modalTitulo').textContent = data.titulo;
    document.getElementById('modalFechaEstreno').textContent = data.fechaEstreno;
    document.getElementById('modalVotosPromedio').textContent = data.votosPromedio;

    modal.style.display = 'flex'; // Mostrar el modal
}

// Evento para cerrar el modal
document.querySelector('.cerrar-modal').addEventListener('click', function() {
    document.getElementById('modalSerie').style.display = 'none';
});

// Cerrar el modal al hacer clic fuera del contenido del modal
window.addEventListener('click', function(event) {
    const modal = document.getElementById('modalSerie');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
});


// Listener para cargar series al hacer clic en el botón
document.getElementById('btnCargarSeries').addEventListener('click', (e) => {
    e.preventDefault(); // evitar que el href salte arriba
    cargarSeries();
});


// Listener para el nuevo botón "Volver al inicio"
document.getElementById('btnVolverInicio').addEventListener('click', (e) => {
  e.preventDefault(); // Evita que la página salte al principio si el href es "#"
  
  // Opciones para "volver al inicio":

  // 1. Desplazar la ventana al principio de la página:
  window.scrollTo({
      top: 0,
      behavior: 'smooth' // Desplazamiento suave
  });
});