window.onload = function() {
    const frases = [
        "Todo pasa por algo",
        "Lo mejor está por venir",
        "Soñando en grande"
    ];

    const fraseAleatoria = frases[Math.floor(Math.random() * frases.length)];
    document.getElementById("frase").innerHTML = `<h2 class="sombra">${fraseAleatoria}</h2>`;
};

function cargarAPI(tipo) {
    if (tipo === "chiste") {
        fetch("https://api.chucknorris.io/jokes/random") // API de chistes de Chuck Norris
            .then(res => res.json())
            .then(datos => {
                const chiste = datos.value;
                document.getElementById("contenidoAPI").innerText = `"${chiste}"`;
            })
            .catch(err => console.error("Error al obtener chiste:", err));
    } else if (tipo === "consejo") {
        fetch("https://api.adviceslip.com/advice") // API de consejos aleatorios 
            .then(res => res.json())
            .then(datos => {
                const consejo = datos.slip.advice;
                document.getElementById("contenidoAPI").innerText = consejo;
            })
            .catch(err => console.error("Error al obtener consejo:", err));
    }
}