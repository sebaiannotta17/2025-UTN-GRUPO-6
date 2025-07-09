const frases = [
    { text: "La literatura no es otra cosa que un sueño dirigido - Jorge Luis Borges", class: "sombra-1" },
    { text: "Hay que tener cuidado al elegir a los enemigos porque uno termina pareciéndose a ellos - Jorge Luis Borges", class: "sombra-2" },
    { text: "Uno llega a ser grande por lo que lee y no por lo que escribe - Jorge Luis Borges", class: "sombra-3" }
];


function obtenerFraseAleatoria() {
    const indiceAleatorio = Math.floor(Math.random() * frases.length);
    return frases[indiceAleatorio];
}


window.addEventListener('load', () => {
    const fraseSeleccionada = obtenerFraseAleatoria();
    const divFrase = document.getElementById('fraseAleatoria');

    if (divFrase) {
        divFrase.innerHTML = `<p class="${fraseSeleccionada.class}">${fraseSeleccionada.text}</p>`;
    }
});


const enlaceApiClima = document.getElementById("api-clima");
const mainContent = document.querySelector('.contenido');


async function climaSegunCiudad(ciudad) {
    const urlClima = `https://wttr.in/${ciudad}?format=j1`;

    try {
        const respuestaClima = await fetch(urlClima);
        if (!respuestaClima.ok) {
            alert("No se pudo obtener la informacion del clima");
        }
        const infoClima = await respuestaClima.json();

        const climaActual = infoClima.current_condition[0];
        const nombreArea = infoClima.nearest_area && infoClima.nearest_area.length > 0 ? infoClima.nearest_area[0].areaName[0].value : ciudad;

        mainContent.innerHTML = `
            <h2 style="text-align: center;">Clima en ${nombreArea}</h2>
            <div style="padding: 15px; border: 1px solid #eee; background-color: #f9f9f9; border-radius: 8px; max-width: 400px; margin: 20px auto;">
                <p><strong>Temperatura:</strong> ${climaActual.temp_C}°C (Sensación térmica: ${climaActual.FeelsLikeC}°C)</p>
                <p><strong>Descripción:</strong> ${climaActual.weatherDesc[0].value}</p>
                <p><strong>Humedad:</strong> ${climaActual.humidity}%</p>
                <p><strong>Viento:</strong> ${climaActual.windspeedKmph} km/h</p>
                <p style="font-size: 2px; color: #666;">Datos de wttr.in</p>
            </div>
        `;

    } catch (error) {
        alert("Error: ", error);
    }
}


enlaceApiClima.addEventListener('click', (event) => {
    event.preventDefault();
    climaSegunCiudad('La Plata');
});