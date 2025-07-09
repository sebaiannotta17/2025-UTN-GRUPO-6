// Frases aleatorias
const frases = [
  "¡Programar es crear realidades con lógica!",
  "Una buena interfaz es invisible.",
  "Las APIs son las ventanas al mundo de la web.",
  "El código limpio es poesía en movimiento.",
  "Depurar es como ser detective en un misterio donde el asesino sos vos.",
  "Todo gran poder conlleva una gran responsabilidad... especialmente si tenés acceso root."
];

window.onload = () => {
  const fraseElegida = frases[Math.floor(Math.random() * frases.length)];
  document.getElementById("frase-random").textContent = fraseElegida;
};

// API 1 – Imagenes de perros (https://dog.ceo), es una gratis con la qu eno tengo que usar apikey
function mostrarAPI1() {
  fetch("https://dog.ceo/api/breeds/image/random")
    .then(res => res.json())
    .then(data => {
      document.getElementById("contenido").innerHTML = `
        <h2>Imagen aleatoria de un perro 🐶</h2>
        <img src="${data.message}" alt="perro" style="max-width: 300px;">
      `;
    });
}

// API 2 – Chistes de programación (https://v2.jokeapi.dev), es en ingles pero como, no consigo otra gratis voy con esta
function mostrarAPI2() {
  fetch("https://v2.jokeapi.dev/joke/Programming?type=single")
    .then(res => res.json())
    .then(data => {
      document.getElementById("contenido").innerHTML = `
        <h2>Chiste nerd 🤓</h2>
        <p>${data.joke}</p>
      `;
    });
}
