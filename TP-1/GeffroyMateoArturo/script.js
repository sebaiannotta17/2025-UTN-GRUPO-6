//-------------------------------FRASES ALEATORIAS Y EXPECTATIVAS-------------------------------
const frasesAleatorias = [
    "HTML es un lenguaje de marcado.",
    "CSS se utiliza para dar estilo a las páginas web.",
    "JavaScript es un lenguaje de programación.",
];
function obtenerFraseAleatoria() {
    const indiceAleatorio = Math.floor(Math.random() * frasesAleatorias.length);
    return frasesAleatorias[indiceAleatorio];
}
const expectativa = "Mi expectativa en la cátedra de Tecnología y Gestión Web es adquirir los conocimientos y las herramientas necesarias para desarrollar aplicaciones web y así poder aplicarlas en proyectos, tanto las tecnologías del lado del cliente (HTML, CSS y JavaScript) como la comunicación con el servidor a través de las APIs.";

//-------------------------------Definicion de colores y elementos-------------------------------
const barraLateral = document.getElementById("sidebar");
const contenidoPrincipal = document.getElementById("contenido-principal")
const linkInicio = document.getElementById("enlace-inicio");
const linkJuegos = document.getElementById("enlace-api-freetogame");
const linkSpotify = document.getElementById("enlace-api-spotify");
const COLOR_INICIO_FONDO = 'white';
const COLOR_INICIO = 'black';
const COLOR_F2G_FONDO = 'rgb(255, 0, 0, 0.2)';
const COLOR_F2G = 'rgb(255, 0, 0)';
const COLOR_SPOTIFY_FONDO = 'rgb(0, 218, 107, 0.2)';
const COLOR_SPOTIFY = 'rgb(0, 218, 107)';

//----------------------------------PAGINA DE INICIO----------------------------------
function mostrarPaginaInicio(){
    contenidoPrincipal.innerHTML = '';
    if (barraLateral) {
        barraLateral.style.backgroundColor = COLOR_INICIO;
    }
    if (contenidoPrincipal) {
        contenidoPrincipal.style.backgroundColor = COLOR_INICIO_FONDO;
    }
    if (linkInicio) {
        linkInicio.style.color = 'white';
    }
    if (linkJuegos) {
        linkJuegos.style.color = 'white';
    }
    if (linkSpotify) {
        linkSpotify.style.color = 'white';
    }

    const fraseP = document.createElement("p");
    fraseP.id = 'frase-aleatoria';
    fraseP.textContent = obtenerFraseAleatoria();
    const expectativaP = document.createElement("p");
    expectativaP.id = 'expectativa';
    expectativaP.textContent = expectativa;
    contenidoPrincipal.appendChild(fraseP);
    contenidoPrincipal.appendChild(expectativaP);
}

//----------------------------------API DE FREE TO GAME (antes F1)----------------------------------
const CATEGORIAS_JUEGOS = ["action", "action-rpg", "anime", "card", "fantasy", "fighting", "first-person", "horror", "low-spec", "military", "mmorpg", "moba", "open-world", "pixel", "pvp", "pve", "racing", "sailing", "sandbox", "sci-fi", "shooter", "side-scroller", "social", "space", "sports", "strategy", "superhero", "survival", "tank", "third-person", "top-down", "tower-defense", "turn-based", "voxel", "zombie", "2d", "3d"];

function mostrarPaginaFreeToGame(){
    contenidoPrincipal.innerHTML = '';
    if (barraLateral) {
        barraLateral.style.backgroundColor = COLOR_F2G;
    }
    if (contenidoPrincipal) {
        contenidoPrincipal.style.backgroundColor = COLOR_F2G_FONDO;
    }
    if (linkInicio) {
        linkInicio.style.color = 'black';
    }
    if (linkJuegos) {
        linkJuegos.style.color = 'black';
    }
    if (linkSpotify) {
        linkSpotify.style.color = 'black';
    }

    let selectOptions = CATEGORIAS_JUEGOS.map(categoria => `<option value="${categoria}">${categoria.charAt(0).toUpperCase() + categoria.slice(1).replace(/-/g, ' ')}</option>`).join('');
    const freeToGameHtml = `
        <div id="contenedor-f2g">
            <h2 id="titulo-f2g">Juegos Gratuitos por Categoría</h2>
            <form id="formulario-f2g">
                <label for="f2g-categoria-select">Categoría de Juego:</label>
                <select id="f2g-categoria-select">
                    <option value="">Selecciona una categoría</option>
                    ${selectOptions}
                </select>
                <button type="submit" id="buscar-f2g">Buscar Juego Aleatorio</button>
            </form>
            <div id="resultado-juego-f2g" class="resultado-f2g-estilo"></div>
        </div>
    `;
    contenidoPrincipal.innerHTML = freeToGameHtml;

    const formularioF2G = document.getElementById("formulario-f2g");
    if (formularioF2G) {
        formularioF2G.addEventListener("submit", handleFreeToGameSearch);
    }
}

async function buscarJuegosPorCategoria(categoria) {
    const resultadoJuegoDiv = document.getElementById('resultado-juego-f2g');
    if (!categoria && resultadoJuegoDiv) {
        resultadoJuegoDiv.innerHTML = '<p class="mensaje-f2g error-f2g">Por favor, selecciona una categoría.</p>';
        return null;
    }
    if (resultadoJuegoDiv) resultadoJuegoDiv.innerHTML = `<div class="mensaje-f2g"><p>Buscando juegos de ${categoria.replace(/-/g, ' ')}...</p></div>`;
    
    const proxyUrl = 'https://api.allorigins.win/raw?url=';
    const targetUrl = `https://www.freetogame.com/api/games?category=${encodeURIComponent(categoria)}`;
    const url = proxyUrl + encodeURIComponent(targetUrl);

    try {
        const response = await fetch(url);
        if (!response.ok) {
            let errorData = await response.text();
            console.error("Respuesta no OK del proxy o API:", errorData);
            throw new Error(`Error HTTP! Estado: ${response.status}.`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error al buscar juegos con proxy:", error);
        if (resultadoJuegoDiv) resultadoJuegoDiv.innerHTML = `<p class="mensaje-f2g error-f2g">Error al buscar juegos: ${error.message}</p>`;
        return null;
    }
}

function mostrarInfoJuego(juego, categoriaSeleccionada) {
    const contenedorF2G = document.getElementById('contenedor-f2g'); 

    if (!juego || !contenedorF2G) {
        if(contenedorF2G) {
            const resultadoJuegoDiv = contenedorF2G.querySelector('#resultado-juego-f2g') || contenedorF2G;
            resultadoJuegoDiv.innerHTML = `<p class="mensaje-f2g error-f2g">No se pudo mostrar información del juego.</p>`;
        }
        return;
    }
    
    contenedorF2G.innerHTML = `
        <h2 id="titulo-f2g">¡Aquí tienes un juego de "${categoriaSeleccionada.replace(/-/g, ' ')}"!</h2>
        <div id="info-juego" class="resultado-f2g-estilo">
            <div class="game-card">
                <a href="${juego.game_url}" target="_blank">
                    <img src="${juego.thumbnail}" alt="Miniatura de ${juego.title}">
                </a>
                <div class="game-details">
                    <h3>${juego.title}</h3>
                    <p><strong>Plataforma:</strong> ${juego.platform}</p>
                    <p><strong>Publicado por:</strong> ${juego.publisher}</p>
                    <p><strong>Fecha de Lanzamiento:</strong> ${juego.release_date}</p>
                    <div class="botones-f2g">
                        <a href="${juego.game_url}" target="_blank" class="f2g-button">Jugar Ahora</a>
                        <a href="#" class="f2g-button" id="botonVerOtroJuegoF2G">Buscar otro juego</a>
                    </div>
                </div>
            </div>
        </div>
    `;

    const botonVerOtroJuegoF2G = document.getElementById("botonVerOtroJuegoF2G");
    if (botonVerOtroJuegoF2G) {
        botonVerOtroJuegoF2G.addEventListener("click", (e) => {
            e.preventDefault();
            mostrarPaginaFreeToGame();
        });
    }
}

async function handleFreeToGameSearch(event) {
    event.preventDefault();
    const categoriaSelect = document.getElementById("f2g-categoria-select");
    const categoria = categoriaSelect.value;
    const resultadoJuegoDiv = document.getElementById('resultado-juego-f2g'); 

    if (!categoria) {
        if(resultadoJuegoDiv) {
            resultadoJuegoDiv.innerHTML = `<p class="mensaje-f2g error-f2g">Por favor, selecciona una categoría.</p>`;
        } else {
            alert('Por favor, selecciona una categoría.');
        }
        return;
    }

    const juegos = await buscarJuegosPorCategoria(categoria);

    if (juegos && juegos.length > 0) {
        const juegoAleatorio = juegos[Math.floor(Math.random() * juegos.length)];
        mostrarInfoJuego(juegoAleatorio, categoria);
    } else if (juegos && resultadoJuegoDiv) { 
        resultadoJuegoDiv.innerHTML = `<p class="mensaje-f2g">No se encontraron juegos para la categoría "${categoria.replace(/-/g, ' ')}".</p>`;
    }
}

//----------------------------------API DE SPOTIFY----------------------------------
const CLIENTE_ID = "675a0605315340e6bca84512c223955b";
const CLIENTE_SECRET_ID = "026b0415b25d4a4cbb297151e885283e";
const GENEROS_SPOTIFY = ["rock", "blues", "jazz", "electronica", "pop", "trap", "rap", "indie", "alternative", "metal"];
let spotifyTokenAcceso = '';
let tiempoTokenExpiracion = 0;

function mostrarPaginaSpotify(){
    contenidoPrincipal.innerHTML = '';
    if (barraLateral) {
        barraLateral.style.backgroundColor = COLOR_SPOTIFY;
    }
    if (contenidoPrincipal) {
        contenidoPrincipal.style.backgroundColor = COLOR_SPOTIFY_FONDO;
    }
    if (linkInicio) {
        linkInicio.style.color = 'black';
    }
    if (linkJuegos) {
        linkJuegos.style.color = 'black';
    }
    if (linkSpotify) {
        linkSpotify.style.color = 'black';
    }

    let selectOptions = GENEROS_SPOTIFY.map(genero => `<option value="${genero}">${genero.charAt(0).toUpperCase() + genero.slice(1)}</option>`).join('');
    const spotifyHtml = `
        <div id="contenedor-spotify">
            <h2 id="titulo-spotify">¿Qué escuchar hoy?</h2>
            <form id="formulario-spotify">
                <label for="spotify-genero-select">Género Musical:</label>
                <select id="spotify-genero-select">
                    <option value="">Selecciona un género</option>
                    ${selectOptions}
                </select>
                <button type="submit" id="buscar-spotify">Buscar Álbum</button>
            </form>
            <div id="resultado-busqueda-spotify" class="resultado-spotify-estilo"></div>
        </div>
    `;
    contenidoPrincipal.innerHTML = spotifyHtml;

    const formularioSpotify = document.getElementById("formulario-spotify");
    if (formularioSpotify) {
        formularioSpotify.addEventListener("submit", handleSpotifySearch);
    }
}

async function obtenerTokenSpotify() {
    if (spotifyTokenAcceso && Date.now() < tiempoTokenExpiracion) {
        return spotifyTokenAcceso;
    }
    const authOptions = {
        method: 'POST',
        headers: {
            'Authorization': 'Basic ' + btoa(CLIENTE_ID + ':' + CLIENTE_SECRET_ID),
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'grant_type=client_credentials'
    };
    try {
        const response = await fetch('https://accounts.spotify.com/api/token', authOptions);
        if (!response.ok) {
            throw new Error(`Error al obtener el token de Spotify: ${response.statusText}`);
        }
        const data = await response.json();
        spotifyTokenAcceso = data.access_token;
        tiempoTokenExpiracion = Date.now() + (data.expires_in * 1000) - 60000;
        return spotifyTokenAcceso;
    } catch (error) {
        console.error('Error al obtener el token de Spotify:', error);
        const resultadoSpotifyDiv = document.getElementById('resultado-busqueda-spotify');
        if(resultadoSpotifyDiv) resultadoSpotifyDiv.innerHTML = `<p class="mensaje-spotify error-spotify">Error al autenticar con Spotify. Revisa la consola.</p>`;
        return null;
    }
}

async function buscarAlbumSpotify(genero, token) {
    const resultadoSpotifyDiv = document.getElementById('resultado-busqueda-spotify');
    if (!token) {
        console.error("No hay token de acceso para Spotify.");
        if (resultadoSpotifyDiv) resultadoSpotifyDiv.innerHTML = `<p class="mensaje-spotify error-spotify">No se pudo obtener el token para Spotify.</p>`;
        return null;
    }
    try {
        const response = await fetch(`https://api.spotify.com/v1/search?q=genre%3A%22${encodeURIComponent(genero)}%22&type=track&limit=50`, {
            headers: { 'Authorization': 'Bearer ' + token }
        });
        if (!response.ok) {
            throw new Error(`Error al buscar tracks de Spotify: ${response.status} - ${response.statusText}`);
        }
        const data = await response.json();
        if (!data.tracks || data.tracks.items.length === 0) {
            console.log(`No se encontraron tracks para el género: ${genero}`);
            return null;
        }
        const randomTrack = data.tracks.items[Math.floor(Math.random() * data.tracks.items.length)];
        const album = randomTrack.album;
        return {
            name: album.name,
            artist: album.artists.map(artist => artist.name).join(', '),
            releaseYear: album.release_date ? album.release_date.split('-')[0] : 'Desconocido',
            imageUrl: album.images.length > 0 ? album.images[0].url : 'ruta/a/placeholder.png',
            spotifyUrl: album.external_urls.spotify
        };
    } catch (error) {
        console.error("Error al buscar álbum en Spotify:", error);
        if (resultadoSpotifyDiv) resultadoSpotifyDiv.innerHTML = `<p class="mensaje-spotify error-spotify">Error al buscar en Spotify: ${error.message}</p>`;
        return null;
    }
}

async function handleSpotifySearch(event) {
    event.preventDefault();
    const generoItem = document.getElementById("spotify-genero-select");
    const genero = generoItem.value;
    const resultadoSpotifyDiv = document.getElementById('resultado-busqueda-spotify');

    if (!genero) {
        if (resultadoSpotifyDiv) resultadoSpotifyDiv.innerHTML = '<p class="mensaje-spotify error-spotify">Por favor, selecciona un género musical.</p>';
        return;
    }
    if (resultadoSpotifyDiv) resultadoSpotifyDiv.innerHTML = `<div class="mensaje-spotify"><p>Buscando un disco de ${genero}...</p></div>`;

    const token = await obtenerTokenSpotify();
    if (!token) {
        // El mensaje de error ya se maneja dentro de obtenerTokenSpotify si falla
        return;
    }
    const album = await buscarAlbumSpotify(genero, token);

    if (album) {
        const contenedorSpotify = document.getElementById("contenedor-spotify");
        if (contenedorSpotify) {
            contenedorSpotify.innerHTML = `
                <h2 id="titulo-spotify">¡Aquí tienes un disco de ${genero}!</h2>
                <div id="info-album-spotify" class="resultado-spotify-estilo">
                    <div class="album-card">
                        <a href="${album.spotifyUrl}" target="_blank">
                            <img src="${album.imageUrl}" alt="Portada del disco ${album.name}">
                        </a>
                        <div class="album-details">
                            <h3>${album.name}</h3>
                            <p><strong>Artista:</strong> ${album.artist}</p>
                            <p><strong>Año:</strong> ${album.releaseYear}</p>
                            <div class="botones-spotify">
                                <a href="${album.spotifyUrl}" target="_blank" class="spotify-button">Abrir en Spotify</a>
                                <a href="#" class="spotify-button" id="botonVerOtroAlbumSpotify">Buscar otro álbum</a>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            const botonVerOtroAlbumSpotify = document.getElementById("botonVerOtroAlbumSpotify");
            if (botonVerOtroAlbumSpotify) {
                botonVerOtroAlbumSpotify.addEventListener("click", (e) => {
                    e.preventDefault();
                    mostrarPaginaSpotify(); 
                });
            }
        }
    } else {
        if (resultadoSpotifyDiv) resultadoSpotifyDiv.innerHTML = `<p class="mensaje-spotify error-spotify">No se encontraron discos para el género "${genero}". Intenta con otro.</p>`;
    }
}

// Event listeners
document.addEventListener("DOMContentLoaded", () => {
    mostrarPaginaInicio();

    const botonFreeToGame = document.getElementById("enlace-api-freetogame");
    if (botonFreeToGame) botonFreeToGame.addEventListener("click", mostrarPaginaFreeToGame);

    const botonSpotify = document.getElementById("enlace-api-spotify");
    if (botonSpotify) botonSpotify.addEventListener("click", mostrarPaginaSpotify);

    const botonInicio = document.getElementById("enlace-inicio");
    if (botonInicio) botonInicio.addEventListener("click", mostrarPaginaInicio);
});