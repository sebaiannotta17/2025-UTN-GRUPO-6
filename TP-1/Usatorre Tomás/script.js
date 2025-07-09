document.addEventListener('DOMContentLoaded', function() {
  const frases = [
    { texto: "Los gatos no necesitan palabras para demostrar amor", clase: "frase1" },
    { texto: "Donde hay patas, hay hogar", clase: "frase2" },
    { texto: "El perro es el mejor amigo del hombre", clase: "frase3" }
  ];

  const fraseRandom = frases[Math.floor(Math.random() * frases.length)];
  const contenedor = document.getElementById("frase-del-dia");

  contenedor.textContent = fraseRandom.texto;
  contenedor.className = fraseRandom.clase;
});    
    
const randomIndex = Math.floor(Math.random() * phrases.length);
const phrase = phrases[randomIndex];
  
const phraseElement = document.getElementById("randomPhrase");
phraseElement.textContent = phrase.text;
phraseElement.classList.add(phrase.class);
  
document.getElementById("year").textContent = new Date().getFullYear();

function loadAPI(apiName, event) {
  if (event) event.preventDefault();

  const content = document.getElementById("content");

  if (apiName === "perros") {
    content.innerHTML = `<p>Cargando imagen de perro...</p>`;

    fetch("https://dog.ceo/api/breeds/image/random")
      .then(response => response.json())
      .then(data => {
        content.innerHTML = `
          <p><strong>¡Mirá este perro!</strong></p>
          <img src="${data.message}" alt="Perro aleatorio" class="fotos-animales">`;
      })
      .catch(error => {
        content.innerHTML = `<p>Error al cargar la imagen: ${error.message}</p>`;
      });

  } else if (apiName === "gatos") {
    fetch("https://api.thecatapi.com/v1/images/search")
      .then(response => response.json())
      .then(data => {
        content.innerHTML = `
          <p><strong>¡Mirá este gato!</strong></p>
          <img src="${data[0].url}" alt="Gato aleatorio" class="fotos-animales">`;
      })
      .catch(error => {
        content.innerHTML = `<p>Error al cargar la imagen: ${error.message}</p>`;
      });

  } else {
    content.innerHTML = `<p>API "${apiName}" no reconocida.</p>`;
  }
}
