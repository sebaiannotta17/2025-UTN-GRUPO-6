window.addEventListener("DOMContentLoaded", () => {
    const frases = [
        { texto: "“El tiempo que disfrutas perder no es tiempo perdido.” ~ Jhon Lennon", clase: "sombra1" },
        { texto: "“No tengas miedo de crecer lento, ten miedo de quedarte quieto.” ~ Proverbio chino", clase: "sombra2" },
        { texto: "“La suerte es lo que sucede cuando la preparación se encuentra con la oportunidad.” ~ Séneca", clase: "sombra3" }
    ];

    const fraseContainer = document.getElementById("frase-container");
    const seleccionada = frases[Math.floor(Math.random() * frases.length)];

    fraseContainer.textContent = seleccionada.texto;
    fraseContainer.classList.add(seleccionada.clase);
});
