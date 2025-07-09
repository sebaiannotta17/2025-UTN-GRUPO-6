const frases = [
    {
    texto:"'Mi gloria es vivir tan libre como el pájaro del cielo: no hago nido en este suelo'",
    clase:"sombra1"
    },
    {
    texto:"'Hay hombres que de su ciencia tienen la cabeza llena; hay sabios de todas menas, mas digo sin ser muy ducho. Es mejor que aprender mucho. El aprender cosas buenas'",
    clase:"sombra2"
    },
    {
    texto:"'Junta esperencia en la vida hasta pa dar y prestar. Quien la tiene que pasar entre sufrimiento y llanto, porque nada enseña tanto como el sufrir y el llorar'",
    clase:"sombra3"
    }
]

const contenido = document.getElementById("contenido");
 
mostrarFrase();

function mostrarFrase(){

    var frase = frases[Math.floor(Math.random() * frases.length)];
    parrafoFrase = document.createElement("p")
    parrafoFrase.textContent = frase.texto;
    parrafoFrase.className = frase.clase;
    contenido.appendChild(parrafoFrase);


    contenido.appendChild(document.createElement("br"));


    expectativa = "De la materia espero obtener conocimientos sobre la historia de la web y las tecnologías para su desarrollo";
    contenido.appendChild(document.createElement("p")).textContent = expectativa;
};

function apiClima() {

    const url = `https://api.open-meteo.com/v1/forecast?latitude=-34.8715&longitude=-57.8833&current_weather=true&timezone=auto`;

    fetch(url)
        .then(res => res.json())
        .then(data => {
            contenido.innerHTML = `
                <h2>Clima actual en Berisso</h2>
                <p>Hora: ${data.current_weather.time}</p>
                <p>Temperatura: ${data.current_weather.temperature}°C</p>
                <p>Viento: ${data.current_weather.windspeed} km/h</p>
            `;
        })
        .catch(error => {
            contenido.innerHTML = mensajeError("Error al obtener el clima");
        });

    
};

function apiFormula1() {
    
    const url = `https://api.openf1.org/v1/sessions?session_key=latest`;
    fetch(url)
        .then(res => res.json())
        .then(data => {
            const session = data[0];
            contenido.innerHTML = `
                <h2>Datos de la última sesión de Formula 1</h2>
                <p>Lugar: ${session.country_name}</p>
                <p>Circuito: ${session.circuit_short_name}</p>
                <p>Tipo: ${session.session_type}</p>
                <p>Fecha de inicio: ${session.date_start}</p>
                <p>Fecha de fin: ${session.date_end}</p>
            `;
        })
        .catch(() => {
            contenido.innerHTML = mensajeError("Error al obtener datos de la Fórmula 1");
        });


};