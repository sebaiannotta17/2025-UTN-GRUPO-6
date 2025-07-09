const artistaSeleccionado = document.getElementById('artista');
const botonBusqueda = document.getElementById('boton-busqueda');
const contenedorResultado = document.getElementById('contenedor-resultados');
const contenedorLista = document.getElementById('contenedor-lista');
const cancionReproducida = document.getElementById('cancion-reproducida');
const reproductor = document.getElementById('reproductor');
const seccionReproductor = document.getElementById('seccion-reproductor');
const mensajeError = document.getElementById('mensaje-error');

let coleccionCanciones = [];
let nroCancionActual = 0;


botonBusqueda.addEventListener('click', () => {
    const nombreArtista = artistaSeleccionado.value.trim();
    if (nombreArtista) {
        buscarCanciones(nombreArtista);
    } else {
        mensajeError.textContent = 'Por favor, introduce el nombre de un artista.';
        mensajeError.style.display = 'block';
    }
});


reproductor.addEventListener('ended', reproducirSiguienteCancion);



//funciones

function reproducirSiguienteCancion() {
    nroCancionActual = nroCancionActual + 1;

    if (nroCancionActual < coleccionCanciones.length) {
        reproducirCancionActual();
    } else {
        alert("Todas las canciones fueron reproducidas");
        nroCancionActual = 0;
    }
}

function reproducirCancionActual() {
    if (coleccionCanciones.length === 0) {
        seccionReproductor.style.display = 'none';
        return;
    }

    const cancion = coleccionCanciones[nroCancionActual];
    if (cancion && cancion.previewUrl) {
        reproductor.src = cancion.previewUrl;
        cancionReproducida.textContent = `${cancion.trackName} - ${cancion.artistName}`;
        seccionReproductor.style.display = 'block';
        reproductor.load();
        reproductor.play().catch(error => {
            alert("Error al intentar reproducir la canción:", error);
        });
    } else {
        alert(`No se pudo reproducir la canción en el índice ${nroCancionActual}. No hay previewUrl o la canción no existe.`);
        reproducirSiguienteCancion();
    }
}

function mostrarCanciones(canciones) {
    contenedorLista.innerHTML = '';
    canciones.forEach( function(cancion, nroCancion) {
        const itemCancion = document.createElement('div');
        itemCancion.classList.add('item-cancion');
        itemCancion.dataset.index = nroCancion;

        itemCancion.innerHTML = `
            <img src="${cancion.artworkUrl100 || 'placeholder.png'}" alt="${cancion.trackName}">
            <div class="info-cancion">
                <h3>${cancion.trackName}</h3>
                <p>${cancion.artistName} - ${cancion.collectionName || 'Álbum Desconocido'}</p>
            </div>
        `;
        contenedorLista.appendChild(itemCancion);

        itemCancion.addEventListener('click', () => {
            nroCancionActual = nroCancion;
            reproducirCancionActual();
        });
    });
}


async function buscarCanciones(nombreArtista) {
    contenedorLista.innerHTML = '';
    if (mensajeError) {
        mensajeError.style.display = 'none'; 
    } 

    seccionReproductor.style.display = 'none';

    const artistaCodificado = encodeURIComponent(nombreArtista);
    const apiItunes = `https://itunes.apple.com/search?term=${artistaCodificado}&entity=song&limit=20`;

    try {
        const respuestaItunes = await fetch(apiItunes);
        if (!respuestaItunes.ok) {
            alert("Itunes no responde");
        }
        const infoItunes = await respuestaItunes.json();

        coleccionCanciones = infoItunes.results.filter(item => item.kind === 'song' && item.previewUrl);

        if (coleccionCanciones.length === 0) {
            contenedorLista.innerHTML = '<p>No se encontraron canciones para el artista que busco</p>';
            return;
        }

        mostrarCanciones(coleccionCanciones);
        nroCancionActual = 0;
        reproducirCancionActual();
    } catch (error) {
        alert("Error al buscar canciones");
    }
}