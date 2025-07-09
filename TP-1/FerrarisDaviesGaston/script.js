const frases = [
    "Dios da los talentos, pero no viene a tu casa a hacerte la tarea.",
    "El trabajo duro siempre gana.",
    "Yo lo soñé."
];

const fraseAleatoria = frases[Math.floor(Math.random() * frases.length)];
document.getElementById("frase-aleatoria").textContent = fraseAleatoria;