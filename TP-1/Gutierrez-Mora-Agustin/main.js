document.addEventListener('DOMContentLoaded', () => {
    const frases = [
      "Lenguaje de marcado que se utiliza para estructurar y presentar páginas web.",
      "Lenguaje de programación que se utiliza para definir la apariencia visual de páginas web.",
      "Lenguaje de programación que se usa para crear páginas web interactivas."
    ];

    const sombras = [
      "sombra1",
      "sombra2",
      "sombra3"
    ]
  
    const fraseAleatoria = frases[Math.floor(Math.random() * frases.length)];
    const sombraAleatoria = sombras[Math.floor(Math.random() * sombras.length)];

    const fraseConSombra = `<p class="${sombraAleatoria}">${fraseAleatoria}</p>`;
  
    const expectativa = `
      <p>Espero poder adquirir habilidades en desarrollo web, aprender a diseñar interfaces y comprender mejor las tecnologías actuales</p>
    `;
  
    const contenedor = document.getElementById("contenido-principal");
    contenedor.innerHTML = fraseConSombra + expectativa;

    function cargarAPOD() {
      const contenedor = document.getElementById("contenido-principal");
      fetch('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY')
        .then(response => response.json())
        .then(data => {
          if (data.media_type === "image") {
            contenedor.innerHTML = `
              <h2>${data.title}</h2>
              <img src="${data.url}" alt="Imagen del día" width="400">
              <p>${data.explanation}</p>
            `;
          } else if (data.media_type === "video") {
            contenedor.innerHTML = `
              <h2>${data.title}</h2>
              <iframe src="${data.url}" width="560" height="315" frameborder="0" allowfullscreen></iframe>
              <p>${data.explanation}</p>
            `;
          } else {
            contenedor.innerHTML = `<p>El contenido del día no es una imagen ni un video compatible.</p>`;
          }
        })
        .catch(error => {
          contenedor.innerHTML = `<p>Error al obtener la imagen de la NASA.</p>`;
          console.error(error);
        });
    }


    function cargarArgentina() {
      fetch('https://restcountries.com/v3.1/name/argentina')
        .then(response => response.json())
        .then(data => {
          const pais = data[0];
          contenedor.innerHTML = `
            <h2>${pais.name.common}</h2>
            <p><strong>Capital:</strong> ${pais.capital}</p>
            <p><strong>Continente:</strong> ${pais.continents[0]}</p>
            <p><strong>Población:</strong> ${pais.population}</p>
            <img src="${pais.flags.png}" alt="Bandera de Argentina">
          `;
        })
        .catch(error => {
          contenedor.innerHTML = `<p>Error al obtener información del país.</p>`;
          console.error(error);
        });
    }

    document.getElementById('ver-apod').addEventListener('click', (e) => {
      e.preventDefault();
      cargarAPOD();
    });

    document.getElementById('ver-argentina').addEventListener('click', (e) => {
      e.preventDefault();
      cargarArgentina();
    });
  });

