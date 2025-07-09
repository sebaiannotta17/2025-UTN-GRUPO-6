const giphykey = "XAvtbTGDUGV97zpq7iXzfTMck9Oblatc";   
const tenorkey = "AIzaSyDwFsV8ndbE12hJreiNtetfA2dgx5SkvMY"; 
const idsGpihy = ['Y4mipZLQY8TzuUsC4K','IbmTkriglW2a5PERP7','cMVZlC3j7TFEWhOmcN', 'SVZM1oogNxorPZTBbD', 'kBMXp2UMzKfWxLZIBq', 'ZG0gBttxQuEi7txmOu', 'Us4x5WBZyoBHBqcMC2'];

const frases = [
  'No busco ser perfecto, busco ser constante. Porque sé que el progreso viene con la práctica, tenacidad y disciplina.',
  'Programar me recuerda que siempre hay una forma de mejorar lo que ya existe, y eso aplica tanto al código como a mí mismo.',
  'Cada tecnología que aprendo es una herramienta más para convertir sueños en productos reales.'
];

window.onload = function () {
  const aleatoria = frases[Math.floor(Math.random() * frases.length)];
  const gifSection = document.getElementById("intro");

  gifSection.innerHTML = `
    <div id="frase" class="frase">${aleatoria}</div>
    <div id="expectativa" class="expectativa">
      <h4>Expectativa:</h4>
      <p>
        Espero que esta cátedra me permita afianzar mis conocimientos en desarrollo web, especialmente del lado del cliente, 
        y me prepare para proyectos reales.
      </p>
    </div>`;
};

function ocultarFrase() {
  const frase = document.getElementById("intro");
  const expectativa = document.getElementById("expectativa");
  if (frase) frase.classList.add("oculto");
  if (expectativa) expectativa.classList.add("oculto");
}

function mostrarGiphy() {
  ocultarFrase();
  const section = document.getElementById("gif-section");
  section.innerHTML = "";

  fetch(`https://api.giphy.com/v1/gifs?api_key=${giphykey}&ids=${idsGpihy.join(',')}`)
    .then(res => res.json())
    .then(data => {
      for (let i = 0; i < data.data.length; i++) {
        const gif = document.createElement("img");
        gif.src = data.data[i].images.fixed_height.url;
        section.appendChild(gif);
      }
    })
    .catch(err => console.error("Error en Giphy:", err));
}

function mostrarTenor() {
  ocultarFrase();
  const section = document.getElementById("gif-section");
  section.innerHTML = "";

  fetch(`https://tenor.googleapis.com/v2/search?q=ronalinho&key=${tenorkey}&limit=10`)
    .then(res => res.json())
    .then(data => {
      for (let i = 0; i < data.results.length; i++) {
        const gif = document.createElement("img");
        gif.src = data.results[i].media_formats.gif.url;
        section.appendChild(gif);
      }
    })
    .catch(err => console.error("Error en Tenor:", err));
}

document.getElementById("api1-aside").addEventListener("click", (e) => {
  e.preventDefault();
  mostrarGiphy();
});

document.getElementById("api2-aside").addEventListener("click", (e) => {
  e.preventDefault();
  mostrarTenor();
});
