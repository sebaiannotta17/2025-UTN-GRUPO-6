document.addEventListener("DOMContentLoaded", function () {
    const frases = [
        "Un pequeño paso para el hombre, un salto gigante para la humanidad.",
        "El espíritu de exploración humana es una de las cosas que nos hace quienes somos",
        "Al infinito... ¡y más allá!"
    ];

    const fraseMostradaElemento = document.getElementById("FraseMostrada");
    const frasesAleatoriasElemento = document.getElementById("FrasesAleatorias");
    const expectativaElemento = document.getElementById("Expectativa");
    const linkNASA = document.getElementById("linkApiNasa");
    const linkISS = document.getElementById("LinkApiIss"); 
    const contenidoPrincipal = document.querySelector("main");
    const contenidoPrincipalApi = document.getElementById("ContenidoAPI");
    

    function mostrarFraseAleatoria() {
        const indice = Math.floor(Math.random() * frases.length);
        const frase = frases[indice];
        fraseMostradaElemento.textContent = frase; // muestra la frase sin sombra

        const claseSombraFrase = `sombra-${indice + 1}`;
        frasesAleatoriasElemento.className = claseSombraFrase;

    }

    function cargarNASA() {
        const apiUrl = 'https://api.nasa.gov/planetary/apod?api_key=7a4mFcmGRgwoaPDqVrMpGZfR54yu7ksVTV3iujRd';
        contenidoPrincipalApi.innerHTML = '<p>Cargando la imagen del día...</p>'; 
        
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                contenidoPrincipalApi.innerHTML = `
                    <h2>Foto astronómica del día</h2>
                    <img src="${data.url}" alt="${data.title}">
                    <h3>${data.title}</h3>
                    <p>${data.explanation}</p>
                    <p>Fecha: ${data.date}</p>
                `;
            })
            .catch(error => {
                contenidoPrincipalApi.innerHTML = `<p>Error al cargar la imagen del día: ${error}</p>`;
            });
    }

    // Función para consumir y mostrar la API de Open Notify (Ubicación de la ISS)
    function cargarISS() {
        const apiUrl = 'http://api.open-notify.org/iss-now.json';
        contenidoPrincipalApi.innerHTML = '<p>Cargando ubicación de la ISS...</p>';

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                const latitude = data.iss_position.latitude;
                const longitude = data.iss_position.longitude;
                contenidoPrincipalApi.innerHTML = `
                    <h2>Ubicación Actual de la Estación Espacial Internacional</h2>
                    <p>Latitud: ${latitude}</p>
                    <p>Longitud: ${longitude}</p>
                    <p>Puedes buscar estas coordenadas en un mapa para ver la ubicación exacta.</p>
                `;
            })
            .catch(error => {
                contenidoPrincipalApi.innerHTML = `<p>Error al cargar la ubicación de la ISS: ${error}</p>`;
            });
    }

    // Event listeners para los clicks en los enlaces
    linkNASA.addEventListener('click', function(event) {
        event.preventDefault();
        contenidoPrincipalApi.innerHTML = '<p>Cargando la imagen del día...</p>';
        cargarNASA();
    });

    linkISS.addEventListener('click', function(event) {
        event.preventDefault();
        contenidoPrincipalApi.innerHTML = '<p>Cargando la ubicación de la ISS...</p>';
        cargarISS();
    });

    expectativaElemento.textContent = "Mi expectativa en esta materia es poder aprender buenas prácticas del uso de tecnologías web "

    mostrarFraseAleatoria();









});