window.onload = function() {
    const frases = [
        "El conocimiento es poder.",
        "aguante messi",
        "ola."
    ];

    const fraseAleatoria = frases[Math.floor(Math.random() * frases.length)];
    document.getElementById("frase").innerHTML = `<h2 class="sombra">${fraseAleatoria}</h2>`;
};

function cargarAPI(api, evento) {
    evento.preventDefault();

    const urls = {
        api1: 'https://api.kanye.rest/', // API de citas de Kanye West
        api2: 'https://catfact.ninja/fact' // API de datos de gatos
    };

    const urlSeleccionada = urls[api];

    fetch(urlSeleccionada)
        .then(respuesta => respuesta.json())
        .then(datos => {
            if (api === 'api1') {
                // Procesa la respuesta de Kanye Rest
                const cita = datos.quote; // La cita está en 'quote'
                document.getElementById("contenido-api").innerText = `"${cita}" - Kanye West`;
            } else if (api === 'api2') {
                // Procesa la respuesta de CatFact
                const dato = datos.fact;
                document.getElementById("contenido-api").innerText = dato;
            }
        })
        .catch(error => {
            document.getElementById("contenido-api").innerText = "Error al cargar la API.";
            console.error(error);
        });
}