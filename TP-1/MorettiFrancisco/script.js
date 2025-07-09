document.addEventListener('DOMContentLoaded', () => {
    const content = document.querySelector('.content');

    // Mostrar frase aleatoria al iniciar
    mostrarFraseAleatoria();

    // Click en el logo → nueva frase aleatoria
    document.getElementById('logo-button').addEventListener('click', mostrarFraseAleatoria);

    // Botón: Imagen aleatoria de perro
    document.getElementById('dog-api-btn').addEventListener('click', mostrarImagenDePerro);

    // Botón: Clima en Buenos Aires
    document.getElementById('weather-api-btn').addEventListener('click', mostrarClima);
});

const frases = [
    { texto: "Trabajo Practico Nro 1", clase: "sombra1" },
    { texto: "Tecnología y gestión web.", clase: "sombra2" },
    { texto: "UTN - Facultad Regional La Plata", clase: "sombra3" }
];

function mostrarFraseAleatoria() {
    const random = Math.floor(Math.random() * frases.length);
    const { texto, clase } = frases[random];

    document.querySelector('.content').innerHTML = `
        <h2 class="${clase}">${texto}</h2>
        <p class="descripcion">Mis expectativas para esta cátedra son aprender sobre desarrollo front-end y su integración con el back-end.</p>
    `;
}

function mostrarImagenDePerro() {
    const content = document.querySelector('.content');
    content.innerHTML = mensajeCargando("Cargando imagen...");

    fetch('https://dog.ceo/api/breeds/image/random')
        .then(response => response.json())
        .then(data => {
            content.innerHTML = `
                <h2>🐶 Imagen aleatoria de un perro</h2>
                <img src="${data.message}" alt="Perro aleatorio" style="max-width: 100%; height: auto; border: 2px solid white; border-radius: 10px;">
            `;
        })
        .catch(() => {
            content.innerHTML = mensajeError("Error al cargar la imagen 😢");
        });
}

function mostrarClima() {
    const content = document.querySelector('.content');
    content.innerHTML = mensajeCargando("Cargando clima...");

    const url = `https://api.open-meteo.com/v1/forecast?latitude=-34.61&longitude=-58.38&current_weather=true`;

    fetch(url)
        .then(res => res.json())
        .then(data => {
            const { temperature, windspeed, time } = data.current_weather;
            content.innerHTML = `
                <h2>🌦 Clima actual en Buenos Aires</h2>
                <p>Temperatura: ${temperature}°C</p>
                <p>Viento: ${windspeed} km/h</p>
                <p>Hora: ${time}</p>
            `;
        })
        .catch(error => {
            console.error("Error al obtener clima:", error);
            content.innerHTML = mensajeError("Error al obtener el clima 😢");
        });
}

function mensajeCargando(texto) {
    return `<p style="text-align: center; font-style: italic;">${texto}</p>`;
}

function mensajeError(texto) {
    return `<p style="text-align: center; color: red;">${texto}</p>`;
}
