document.addEventListener('DOMContentLoaded', () => {
    const frases = [
        document.getElementById('frase1'),
        document.getElementById('frase2'),
        document.getElementById('frase3')
    ];

    const randomIndex = Math.floor(Math.random() * frases.length);
    const fraseAleatoria = frases[randomIndex];

    if (fraseAleatoria) { 
        fraseAleatoria.style.display = 'block'; 
    }
});