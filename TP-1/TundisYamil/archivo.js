
function llamadaApi1() {
    event.preventDefault();

    fetch('https://pokeapi.co/api/v2/pokemon/pikachu')
    .then(response => response.json())
    .then(data => {
      const resultado = document.getElementById('resultado');
      resultado.innerHTML = `
        <h2> API Pokemon: <br><br> ${data.name.toUpperCase()}</h2>
        <p><strong>ID:</strong> ${data.id}</p>
        <p><strong>Tipo:</strong> ${data.types.map(t => t.type.name).join(', ')}</p>
        <img src="${data.sprites.front_default}" alt="Pikachu" id="devolu">
      `;
    })
    .catch(error => {
      console.error('Error:', error);
      document.getElementById('resultado').innerHTML = 'Ocurrió un error al buscar los datos.';
    });
}


function llamadaApi2() {
    event.preventDefault();
 
    fetch('https://official-joke-api.appspot.com/jokes/programming/random')
    .then(response => response.json())
    .then(data => {
        document.getElementById('chiste').innerHTML = `<h3>API Chistes informaticos:</h3><p>${data[0].setup}</p><p><strong> ${data[0].punchline}</strong></p>`;
    })
    .catch(error => {
      console.error('Error:', error);
      document.getElementById('chiste').innerHTML = 'Ocurrió un error al buscar los datos.';
    });
}

const frases = [
  "La vida es bella.",
  "El conocimiento es poder.",
  "Haz lo que amas.",
  "Sigue tus sueños.",
  "La práctica hace al maestro."
];

function mostrarFraseAleatoria() {
  const indice = Math.floor(Math.random() * frases.length);
  document.getElementById("frase").textContent = frases[indice];
}
window.addEventListener("DOMContentLoaded", mostrarFraseAleatoria);