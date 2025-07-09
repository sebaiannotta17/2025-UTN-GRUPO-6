const frases = [
  "Este es el tp individual de tygweb.",
  "Hacer este trabajo fue divertido.",
  "Con este trabajo aprendí muchas cosas."
];

window.onload = function () {
  const frase = frases[Math.floor(Math.random() * frases.length)];
  document.getElementById("fraseAleatoria").textContent = frase;
};

function cargarApi1() {
  fetch("https://dog.ceo/api/breeds/image/random")
    .then(res => res.json())
    .then(data => {
      document.getElementById("resultado").innerHTML =
        `<img src="${data.message}" alt="Imagen de perro">`;
    });
}

function cargarApi2() {
  fetch("https://catfact.ninja/fact")
    .then(res => res.json())
    .then(data => {
      document.getElementById("resultado").innerHTML =
        `<p><strong>Dato curioso:</strong> ${data.fact}</p>`;
    });
}
