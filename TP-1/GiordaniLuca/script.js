const frases = [
  { texto: "El pesimista ve la dificultad en cada oportunidad. El optimista ve la oportunidad en cada dificultad. — Winston Churchill", sombra: "2px 2px 5px red" },
  { texto: "«La educación es el arma más poderosa para cambiar el mundo». — Nelson Mandela", sombra: "2px 2px 5px blue" },
  { texto: "«Todo lo que siempre has deseado está al otro lado del miedo». — George Addair", sombra: "2px 2px 5px green" }
];

window.onload = function () {
  const aleatoria = frases[Math.floor(Math.random() * frases.length)];
  const fraseEl = document.getElementById("frase");
  fraseEl.textContent = aleatoria.texto;
  fraseEl.style.textShadow = aleatoria.sombra;
};

function mostrarAPI(tipo) {
  const cont = document.getElementById("contenido");
  cont.innerHTML = ""; 

  if (tipo === "perros") {
    for (let i = 0; i < 3; i++) {
      fetch("https://dog.ceo/api/breeds/image/random")
        .then(r => r.json())
        .then(data => {
          const img = document.createElement("img");
          img.src = data.message;
          cont.appendChild(img);
        });
    }
  }

  if (tipo === "gatos") {
    for (let i = 0; i < 3; i++) {
      fetch("https://api.thecatapi.com/v1/images/search?mime_types=gif")
        .then(r => r.json())
        .then(data => {
          const img = document.createElement("img");
          img.src = data[0].url;
          cont.appendChild(img);
        });
    }
  }
}
