const frases = [
  "Explorando el mundo del desarrollo web.",
  "Aprender CSS es clave para un buen diseño.",
  "JavaScript hace que las páginas cobren vida."
];

console.log("script.js cargado");

window.onload = function () {
  const random = Math.floor(Math.random() * frases.length);
  const fraseElemento = document.getElementById("frase");
  fraseElemento.textContent = frases[random];

  // Aplicar sombra aleatoria
  fraseElemento.style.textShadow = `${Math.random() * 5}px ${Math.random() * 5}px 3px rgba(0,0,0,0.3)`;

  document.getElementById("api1").addEventListener("click", function (e) {
    e.preventDefault(); // evita que recargue o redirija
    fetch("https://dog.ceo/api/breeds/image/random")
        .then(res => res.json())
        .then(data => {
            document.getElementById("frase").innerHTML = `<img src="${data.message}" alt="Perro aleatorio" style="max-width: 100%;">`;
        });
  });

    // Otro ejemplo de API (opcional)
  document.getElementById("api2").addEventListener("click", function (e) {
    e.preventDefault();
      fetch("https://api.adviceslip.com/advice")
      .then(res => res.json())
      .then(data => {
        document.getElementById("frase").textContent = data.slip.advice;
      });
  });

};

