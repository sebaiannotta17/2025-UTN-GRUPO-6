window.onload = function() {
    const frases = [
        "Quiero aprender a tejer.",
        "Hace frío",
        "Está feo el clima"
    ];

    const fraseAleatoria = frases[Math.floor(Math.random() * frases.length)];
    document.getElementById("frase").innerHTML = `<h2 class="sombra">${fraseAleatoria}</h2>`;
};

function cargarAPI(api, evento) {
    evento.preventDefault();

    const urls = {
        api1: 'https://official-joke-api.appspot.com/jokes/programming/random',
        api2: 'https://meowfacts.herokuapp.com/?lang=esp' // API de datos de gatos
    };

    const urlSeleccionada = urls[api];

    fetch(urlSeleccionada)
        .then(respuesta => respuesta.json())
        .then(datos => {
            if (api === 'api1') {
                const dato = `${datos[0].setup} ${datos[0].punchline}`;
                document.getElementById("contenido").innerText = dato;
            } else if (api === 'api2') {
               
                const dato = datos.data;
                document.getElementById("contenido").innerText = dato;
            }
        })
        .catch(error => {
            document.getElementById("contenido").innerText = "Error al cargar la API.";
            console.error(error);
        });
}
