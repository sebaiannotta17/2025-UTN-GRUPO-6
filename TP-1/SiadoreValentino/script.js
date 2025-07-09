//funcion que busca la letra de una cancion
function buscarLetra(cancion, artista) {
  const contenido = document.querySelector(".contenido");
  contenido.innerHTML = "<p>Buscando...</p>";

  //URL de la API
  const url = `https://api.lyrics.ovh/v1/${encodeURIComponent(
    artista
  )}/${encodeURIComponent(cancion)}`;

  // Pedir los datos a la API
  fetch(url)
    .then((respuesta) => respuesta.json())
    .then((data) => {
      if (data.lyrics) {
        contenido.innerHTML = `
          <h2>Letra de "${cancion}"</h2>
          <pre>${data.lyrics}</pre>
        `;
      } else {
        contenido.innerHTML = `<p>No se encontró la letra</p>`;
      }
    })
    .catch((error) => {
      console.error("Error al buscar la letra:", error);
      contenido.innerHTML = `<p>Error al buscar la letra.</p>`;
    });
}

// funcion para buscar el clima
function traerClima() {
  const contenido = document.querySelector(".contenido");
  contenido.innerHTML = "<p>Cargando clima...</p>";

  fetch("https://wttr.in/Buenos%20Aires?format=3")
    .then((respuesta) => respuesta.text())
    .then((data) => {
      contenido.innerHTML = `
          <h2>Clima actual:</h2>
          <p>${data}</p>
        `;
    })
    .catch((error) => {
      console.error("Error al traer clima:", error);
      contenido.innerHTML = "<p>Error al buscar el clima.</p>";
    });
}

// funcion para mostrar una frase aleatoria
function mostrarFraseAleatoria() {
  const frases = [
    {
      texto: "Un tornado arrasó a tu ciudad, y a tu jardín primitivo",
      clase: "sombra1",
    },

    {
      texto: "Hola Frank, ¿cómo estás?, yo bien… un poco harto, nada más.",
      clase: "sombra2",
    },
    {
      texto: "El de saco beige, se agachó ante el rey. Hombres simulados, con olor a hotel.",
      clase: "sombra3",
    },
  ];
  const fraseElegida = frases[Math.floor(Math.random() * frases.length)];
  const contenido = document.querySelector(".contenido");

  contenido.innerHTML = `<h2 class="${fraseElegida.clase}">${fraseElegida.texto}</h2>
    <p class = "expectativas">
        Mis expectativas para esta materia son poder aprender lo necesario para desarrollar y adquirir bases sólidas.
    </p>

    `;
}

//mostramos la frase aleatoria cuando carga la pagina
window.onload = mostrarFraseAleatoria;
