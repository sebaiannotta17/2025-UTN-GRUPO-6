window.onload = function () {
    const frases = [
        { texto: "Si lo puedes imaginar, lo puedes programar.", clase: "frase1" },
        { texto: "Si el codigo funciona, no lo toques.", clase: "frase2" },
        { texto: "La ciencia de hoy es la tecnologia de mañana", clase: "frase3" }
    ];

    const elegida = frases[Math.floor(Math.random() * frases.length)];
    const divFrase = document.getElementById("frase");
    divFrase.textContent = elegida.texto;
    divFrase.classList.add(elegida.clase);
};


function loadAPI(tipo) {
    const contenedor = document.getElementById("contenidoAPI");
    contenedor.innerHTML = "Cargando...";

    if (tipo === "imagen") {
        document.getElementById("contenidoAPI").innerHTML = `
        <img src="https://picsum.photos/400/300?random=${Date.now()}" alt="Paisaje">
        `;
    } else if (tipo === "chiste") {
        fetch('https://v2.jokeapi.dev/joke/Any?lang=es')
            .then(res => res.json())
            .then(data => {
                let chiste = data.type === "single" ? data.joke : `${data.setup} - ${data.delivery}`;
                document.getElementById("contenidoAPI").innerHTML = `<p>${chiste}</p>`;
  });

    }
}
