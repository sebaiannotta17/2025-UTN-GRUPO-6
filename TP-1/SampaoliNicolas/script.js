function mostrarFrase() {
  const frases = [
    { texto: "Aprender es crecer", clase: "frase1" },
    { texto: "HTML estructura, CSS decora", clase: "frase2" },
    { texto: "JavaScript da vida", clase: "frase3" }
  ];

  const expectativa = "La expectativa que tengo yo de esta materia es aprender a desarrollar paginas web, tanto su estructura como su funcionamiento, para en un futuro poder implementarlo, tanto sea de uso personal como de forma laboral.";

  const i = Math.floor(Math.random() * frases.length);
  const f = frases[i];

  const frase = document.createElement("p");
  frase.className = f.clase;
  frase.textContent = f.texto;

  const expectativap = document.createElement("p");
  expectativap.id = "expectativaEstilos";
  expectativap.textContent = expectativa;

  const contenido = document.getElementById("contenido");
  contenido.innerHTML = ""; // BORRA lo anterior antes de agregar cosas nuevas
  contenido.appendChild(frase);
  contenido.appendChild(expectativap);
}


function testAPI() {
  fetch("https://catfact.ninja/fact")
    .then(response => response.json())
    .then(data => {
      document.getElementById("contenido").innerHTML = `<p>${data.fact}</p>`;
    })
    .catch(error => {
      console.log(error);
      document.getElementById("contenido").innerHTML = "<p>Error al conectar con la API.</p>";
    });
}

function mostrarDato() {
  const datos = [
    "El primer sitio web fue publicado en 1991 por Tim Berners-Lee.",
    "HTTP significa HyperText Transfer Protocol.",
    "JavaScript fue creado en solo 10 días."
  ];

  const i = Math.floor(Math.random() * datos.length);
  const dato = datos[i];

  document.getElementById("contenido").innerHTML = `<p><strong>${dato}</strong></p>`;
}


function mostrarChiste() {
  fetch("https://official-joke-api.appspot.com/jokes/programming/random")
    .then(response => response.json())
    .then(data => {
      const chiste = data[0];
      const contenidoHTML = `
        <p><strong>${chiste.setup}</strong></p>
        <p>${chiste.punchline}</p>
      `;
      document.getElementById("contenido").innerHTML = contenidoHTML;
    })
    .catch(error => {
      document.getElementById("contenido").innerHTML = "<p>No se pudo cargar el chiste 😞</p>";
      console.error("Error al cargar la API:", error);
    });
}

function mostrarFraseAPI() {
  fetch("https://api.quotable.io/random")
    .then(response => response.json())
    .then(data => {
      const frase = data.content;
      const autor = data.author;

      document.getElementById("contenido").innerHTML = `
        <p><strong>${frase}</strong></p>
        <p style="text-align: right;">— ${autor}</p>
      `;
    })
    .catch(() => {
      document.getElementById("contenido").innerHTML = "<p>Error al cargar la frase.</p>";
    });
}
