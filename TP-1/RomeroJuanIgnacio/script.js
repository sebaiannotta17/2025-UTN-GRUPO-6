document.addEventListener("DOMContentLoaded", () => {
  const frases = [
    { texto: "“Que la fuerza te acompañe.” – Obi-Wan Kenobi", clase: "sombra1" },
    { texto: "“El miedo lleva a la ira, la ira lleva al odio, el odio lleva al sufrimiento.” – Yoda", clase: "sombra2" },
    { texto: "“La fe en tus amigos te puede sacar de la oscuridad.” – Luke Skywalker", clase: "sombra3" }
  ];


  const indice = Math.floor(Math.random() * frases.length);
  const seleccionada = frases[indice];

 
  const contenedor = document.getElementById("frase-aleatoria");
  contenedor.innerHTML = `<p class="${seleccionada.clase}">${seleccionada.texto}</p>`;
});


function mostrarAPI1() {
  const contenedor = document.getElementById("resultado-api");


  document.getElementById("frase-aleatoria").style.display = "none";
  document.getElementById("expectativa").style.display = "none";

  contenedor.innerHTML = "<p>Cargando clima...</p>";

  const ciudad = "La Plata"; 
  const apiKey = "0db3d9a5654a18e1b837787c80ec9a1f"; 

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},AR&units=metric&lang=es&appid=${apiKey}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      const nombreCiudad = data.name;
      const temperatura = data.main.temp;
      const descripcion = data.weather[0].description;

      contenedor.innerHTML = `
        <h3>Clima en ${nombreCiudad}</h3>
        <p><strong>Temperatura:</strong> ${temperatura} °C</p>
        <p><strong>Estado:</strong> ${descripcion}</p>
      `;
    })
    .catch(error => {
      contenedor.innerHTML = "<p>Error al obtener el clima.</p>";
      console.error(error);
    });
}



function mostrarAPI2() {
  const contenedor = document.getElementById("resultado-api");

  
  document.getElementById("frase-aleatoria").style.display = "none";
  document.getElementById("expectativa").style.display = "none";

  contenedor.innerHTML = "<p>Cargando noticias...</p>";

  const apiKey = "5ed080c80d48b88e92c8e335471414b5";
  const url = `http://api.mediastack.com/v1/news?access_key=${apiKey}&languages=es&limit=1`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data && data.data && data.data.length > 0) {
        const noticia = data.data[0];
        contenedor.innerHTML = `
          <h3>${noticia.title}</h3>
          <p><strong>Fuente:</strong> ${noticia.source}</p>
          <p>${noticia.description}</p>
          <a href="${noticia.url}" target="_blank">Leer más</a>
        `;
      } else {
        contenedor.innerHTML = "<p>No se encontró ninguna noticia.</p>";
      }
    })
    .catch(error => {
      contenedor.innerHTML = "<p>Error al obtener las noticias.</p>";
      console.error(error);
    });
}


