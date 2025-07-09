const lista = document.querySelector("main ul");
const titulo_lista = document.querySelector("h2");
const main = document.querySelector("main");

const frases = [
  "La IA es una enciclopedia con poder interpretativo.",
  "Todos los ciudadanos de una nación deberían poder acceder a una educación de calidad.",
  "La ética es una construcción humana, frágil como su inventor."
]

document.querySelector("section p").textContent += frases[Math.floor(Math.random() * 3)];


document.getElementById("api1").onclick = () => {
  main.style.display = "block";
  titulo_lista.textContent = "Libros de Harry Potter";
  fetch('https://openlibrary.org/search.json?title=harry+potter')
  .then(response => response.json())
  .then(data => {
    lista.innerHTML = '';
    data.docs.slice(0, 5).forEach(libro => {
      const li = document.createElement('li');
      li.textContent = libro.title;
      lista.appendChild(li);
    });
  })
  .catch(error => console.error('Error al obtener libros:', error));
}

document.getElementById("api2").onclick = () => {
  main.style.display = "block";
  titulo_lista.textContent = "Personajes de Rick y Morty";
  fetch('https://rickandmortyapi.com/api/character')
    .then(response => response.json())
    .then(data => {
      lista.innerHTML = '';
      data.results.slice(0, 5).forEach(personaje => {
        console.log(personaje)
        const li = document.createElement('li');
        li.textContent = personaje.name;
        lista.appendChild(li);
      });
    })
    .catch(error => console.error('Error al obtener personajes:', error));
  }