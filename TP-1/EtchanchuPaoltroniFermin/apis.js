//Función para obtener la próxima película/serie del MCU
async function obtenerPeliculaMCU() {
    try {
        const infoApiElement = document.getElementById('info-api');
        infoApiElement.style.display = 'flex';

        const response = await fetch('https://www.whenisthenextmcufilm.com/api');
        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status}`);
        }
        const data = await response.json();

        infoApiElement.innerHTML = `
            <h3>Próxima película del MCU:</h3>
            <p><strong>Título:</strong> ${data.title}</p>
            <p><strong>Fecha de lanzamiento:</strong> ${data.release_date}</p>
            <p><strong>Días restantes:</strong> ${data.days_until}</p>
        `;
    } catch (error) {
        console.error('Error al obtener la película del MCU:', error);
        const infoApiElement = document.getElementById('info-api');
        infoApiElement.style.display = 'flex';
        infoApiElement.textContent = 'No se pudo cargar la información de la película del MCU.';
    }
}

//Función para mostrar el clima en La Plata
async function climaActual() {
    try {
        const infoApiElement = document.getElementById('info-api');
        infoApiElement.style.display = 'flex';

        const response = await fetch('https://wttr.in/la_plata?format=j1');
        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status}`);
        }
        const data = await response.json();
        const clima = data.current_condition[0];

        infoApiElement.innerHTML = `
            <h3>Clima en La Plata:</h3>
            <p><strong>Temperatura:</strong> ${clima.temp_C}°C (${clima.temp_F}°F)</p>
            <p><strong>Sensación térmica:</strong> ${clima.FeelsLikeC}°C (${clima.FeelsLikeF}°F)</p>
            <p><strong>Condición:</strong> ${clima.lang_es[0].value}</p>
            <p><strong>Humedad:</strong> ${clima.humidity}%</p>
            <p><strong>Velocidad del viento:</strong> ${clima.windspeedKmph} km/h</p>
        `;
    } catch (error) {
        console.error('Error al obtener el clima:', error);
        const infoApiElement = document.getElementById('info-api');
        infoApiElement.style.display = 'flex';
        infoApiElement.textContent = 'No se pudo cargar la información del clima.';
    }
}

//Función para mostrar una frase al azar entre tres
document.addEventListener('DOMContentLoaded', () => {
    const frases = [
        { texto: "River es noticia siempre. No porque seamos la mitad más uno, sino porque somos el país menos algunos. Angel Labruna.", claseSombra: "sombra-1" },
        { texto: "Siempre hay que tratar de ser el mejor, pero nunca creerse el mejor. Juan Manuel Fangio.", claseSombra: "sombra-2" },
        { texto: "Para mi la seleccion nacional es River. Angel Labruna.", claseSombra: "sombra-3" }
    ];

    const elementoFraseAleatoria = document.getElementById('frase-aleatoria');

    function mostrarFraseAleatoria() {
        const indiceAleatorio = Math.floor(Math.random() * frases.length);
        const fraseSeleccionada = frases[indiceAleatorio];

        elementoFraseAleatoria.textContent = fraseSeleccionada.texto;

        elementoFraseAleatoria.classList.remove("sombra-1", "sombra-2", "sombra-3");

        elementoFraseAleatoria.classList.add(fraseSeleccionada.claseSombra);
    }

    mostrarFraseAleatoria();
  }
);