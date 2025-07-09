window.addEventListener("DOMContentLoaded", () => {
    const frases = [
        { texto: "El conocimiento es poder.", estilo: "frasestyle1" },
        { texto: "Aprender es crecer.", estilo: "frasestyle2" },
        { texto: "El código es poesía.", estilo: "frasestyle3" }
    ];

    const aleatoria = frases[Math.floor(Math.random() * frases.length)];
    const p = document.getElementById("FraseAleatoria");
    p.textContent = aleatoria.texto;
    p.className = aleatoria.estilo;
});
