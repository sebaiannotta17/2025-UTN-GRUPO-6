// Frases mostradas en el cuerpo
const frases = [
    {
    texto:"'La suma de los cuadrados de los catetos de un triángulo equilátero es igual al cuadrado de la hipotenusa'",
    clase:"sombra1"
    },
    {
    texto:"'La fuerza con que se atraen dos cuerpos es directamente proporcional a sus masas e inversamente proporcional al cuadrado de la distancia'",
    clase:"sombra2"
    },
    {
    texto:"'Un sistema es un conjunto de elementos interrelacionados organizados con un mismo objetivo'",
    clase:"sombra3"
    }
]

// Elegir frase aleatoria
const indiceAleatorio = Math.floor(Math.random() * frases.length);
const fraseSeleccionada = frases[indiceAleatorio];

// Mostrar en el contenido principal
const contenedor = document.getElementById("contenido");
contenedor.classList.remove("sombra1", "sombra2", "sombra3");
contenedor.classList.add(fraseSeleccionada.clase);
// Agregar la nueva clase de sombra
contenedor.classList.add(fraseSeleccionada.clase);

// Mostrar frase aleatoria + frase fija
contenedor.innerHTML = `
    <p>${fraseSeleccionada.texto}</p>
    <p class="frase-fija">Espero que la materia me otorgue las herramientas necesarias para poder diseñar sitios 
    web modernos aplicando el uso de tecnologías actuales.
    </p>
`;

// Eventos API
document.getElementById("api1").addEventListener("click", (e) => {
  e.preventDefault();
  fetch("https://es.wikipedia.org/api/rest_v1/page/summary/World_Wide_Web")
    .then(response => response.json())
    .then(data => {
      document.getElementById("contenido").innerHTML = `
        <div class="api-content">
          <h2>${data.title}</h2>
          <img src="${data.thumbnail.source}" alt="${data.title}">
          <p>${data.extract}</p>
          <a href="${data.content_urls.desktop.page}" target="_blank">Ver en Wikipedia</a>
        </div>
      `;
    });
});

document.getElementById("api2").addEventListener("click", (e) => {
  e.preventDefault();
  fetch("https://dog.ceo/api/breeds/image/random")
    .then(response => response.json())
    .then(data => {
      document.getElementById("contenido").innerHTML = `
        <img src="${data.message}" alt="Perro" style="max-width:400px;">
      `;
    });
});