const content = document.getElementById('content');
const parrafo = document.getElementById('parrafo');
const fraseAleatoriaEl = document.getElementById('fraseAleatoria');

const frases = [
    "La mejor forma de predecir el futuro es crearlo.",
    "El cine es la forma más bella de soñar despierto.",
    "Cada película es un universo por descubrir."
];

const sombra_frases = [
    "sombra_frase1",
    "sombra_frase2",
    "sombra_frase3"
];

function ocultarBienvenida() {
    if (parrafo) parrafo.style.display = 'none';
    if (fraseAleatoriaEl) fraseAleatoriaEl.style.display = 'none';
}

function mostrarBienvenida() {
    if (parrafo) parrafo.style.display = 'block';
    if (fraseAleatoriaEl) fraseAleatoriaEl.style.display = 'block';

    const frase = frases[Math.floor(Math.random() * frases.length)];
    const sombra = sombra_frases[Math.floor(Math.random() * sombra_frases.length)];
    fraseAleatoriaEl.textContent = frase;
    fraseAleatoriaEl.className = sombra;
}

// Configuración de la API
const API_KEY = '9aea13583e5dea10e8f390a9773868ec';
const BASE_URL = 'https://api.themoviedb.org/3';

// Función para obtener y mostrar las películas
function fetchAndDisplay(url) {
    ocultarBienvenida();
    content.innerHTML = '';
    fetch(url)
        .then(response => response.json())
        .then(data => {
            content.innerHTML = '<h2>Resultados</h2>';
            data.results.forEach(item => {
                const movieDiv = document.createElement('div');
                movieDiv.innerHTML = `
                    <h3>${item.title || item.name}</h3>
                    <img src="https://image.tmdb.org/t/p/w200${item.poster_path}" alt="${item.title || item.name}" />
                    <p>${item.overview}</p>
                `;
                content.appendChild(movieDiv);
            });
        })
        .catch(error => {
            content.innerHTML = `<p>Error al cargar datos: ${error}</p>`;
        });
}

// Configuración API Trakt 
const CLIENT_ID = 'ca6ad59c9ade931c795cf58fb524128e74b917b2adf635e5307b283220847407';

// Función para obtener y mostrar películas más valoradas de Trakt 
function fetchAndDisplayTopRated() {
    ocultarBienvenida();
    content.innerHTML = '<h2>Películas Trending </h2>';

    fetch('https://api.trakt.tv/movies/trending', {  
        headers: {
            'trakt-api-version': '2',
            'trakt-api-key': CLIENT_ID
        }
    })
    .then(res => {
        if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
        return res.json();
    })
    .then(data => {
        if (data.length === 0) {
            content.innerHTML += '<p>No se encontraron resultados.</p>';
            return;
        }

        const ul = document.createElement('ul');

        data.forEach(movie => {
            const title = movie.movie.title;
            const year = movie.movie.year;

            const li = document.createElement('li');
            li.textContent = `${title} (${year})`;
            ul.appendChild(li);
        });

        content.appendChild(ul);
    })
    .catch(err => {
        content.innerHTML += `<p>Error al cargar datos: ${err.message}</p>`;
        console.error(err);
    });
}


// Esperar que el DOM esté cargado antes de agregar eventos
document.addEventListener("DOMContentLoaded", () => {
    mostrarBienvenida();

    document.getElementById('popular').addEventListener('click', (e) => {
        e.preventDefault();
        const url = `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=es`;
        fetchAndDisplay(url);
    });

    document.getElementById('trending').addEventListener('click', (e) => {
        e.preventDefault();
        fetchAndDisplayTopRated();
    });
});


