//Mostrar frases aleatorias
window.onload = function() {
  var frases = [
    { texto: "¡Bienvenido/a a mi pagina web!", clase: "frase1" },
    { texto: "Gracias por visitar mi página 😊", clase: "frase2" },
    { texto: "¡Que tengas un lindo día!", clase: "frase3" }
  ];

  const indiceAleatorio = Math.floor(Math.random() * frases.length);
  const contenedor = document.getElementById("frase-aleatoria");

  contenedor.textContent = frases[indiceAleatorio].texto;
  contenedor.className = frases[indiceAleatorio].clase;
};


// Link API´s

document.addEventListener("DOMContentLoaded", function () {
  const linkMusica = document.getElementById("Cargarmusica");
  const linkClima = document.getElementById("Cargarclima");
  const divCancion = document.getElementById("cancion");
  const divClima = document.getElementById("clima");

  let canciones = [];    
  let indice = 0;         

  linkMusica.addEventListener("click", function (e) {
    e.preventDefault();
    divCancion.style.display = "block";
    divClima.style.display = "none";

    if (canciones.length > 0) {
      mostrarCancion(indice);
      indice = (indice + 1) % canciones.length;
      return;
    }

    divCancion.innerHTML = "Cargando música...";

    const artista = "Taylor Swift";
    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(artista)}&limit=50`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        if (!data.results || data.results.length === 0) {
          divCancion.innerHTML = "No se encontraron canciones.";
          return;
        }

        canciones = data.results.filter(cancion => cancion.artistName.toLowerCase() === "taylor swift");

        if (canciones.length === 0) {
          divCancion.innerHTML = "No se encontraron canciones de Taylor Swift.";
          return;
        }

        indice = 0;
        mostrarCancion(indice);
        indice = (indice + 1) % canciones.length;
      })
      .catch(() => {
        divCancion.innerHTML = "Error al cargar la música.";
      });
  });

  function mostrarCancion(i) {
    const c = canciones[i];
    divCancion.innerHTML = `
      <div>
        <img src="${c.artworkUrl100}" alt="Portada">
        <p><strong>Artista:</strong> ${c.artistName}</p>
        <p><strong>Canción:</strong> ${c.trackName}</p>
        <p><strong>Álbum:</strong> ${c.collectionName}</p>
        <a href="${c.previewUrl}" target="_blank" rel="noopener">Escuchar</a>
      </div>
    `;
  }

  linkClima.addEventListener("click", function (e) {
    e.preventDefault();
    divClima.style.display = "block";
    divCancion.style.display = "none";
    divClima.textContent = "Cargando clima...";

    const lat = -34.61;
    const lon = -58.38;

    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`)
      .then(response => response.json())
      .then(data => {
        if (!data.current_weather) {
          divClima.textContent = "No se pudo obtener el clima.";
          return;
        }
        const w = data.current_weather;
        divClima.innerHTML = `
          <p>Temperatura: ${w.temperature} °C</p>
          <p>Viento: ${w.windspeed} km/h</p>
          <p>Código del clima: ${w.weathercode}</p>
        `;
      })
      .catch(() => {
        divClima.textContent = "Error al cargar el clima.";
      });
  });
});