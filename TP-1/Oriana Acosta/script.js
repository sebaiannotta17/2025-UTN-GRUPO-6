
const frases = [
    '¡La magia de Disney está en cada línea de código! ✨',
    'Explorando mundos animados con JavaScript 🧙‍♀️',
    '¡Aprendiendo y soñando como en una peli Disney! 🎬'
  ];
  
  window.onload = () => {
    const frase = frases[Math.floor(Math.random() * frases.length)];
    document.getElementById("contenido").textContent = frase;
    document.getElementById("api1-content").style.display = "none";
    document.getElementById("api2-content").style.display = "none";
  };
  
  document.getElementById("api1").addEventListener("click", (e) => {
    e.preventDefault();
    mostrarPersonajes();
  });
  
  document.getElementById("api2").addEventListener("click", (e) => {
    e.preventDefault();
    mostrarPeliculas();
  });
  
  function mostrarPersonajes() {
    fetch("https://api.disneyapi.dev/character")
      .then(res => res.json())
      .then(data => {
        const personajes = data.data.slice(0, 10);
        const contenedor = document.querySelector(".personajes-content");
        contenedor.innerHTML = personajes.map(p => `<div><strong>${p.name}</strong><br><img src="${p.imageUrl}" width="150"></div>`).join("");
        document.getElementById("api1-content").style.display = "block";
        document.getElementById("api2-content").style.display = "none";
      })
      .catch(err => {
        console.error("Error al cargar personajes:", err);
      });
  }
  
  function mostrarPeliculas() {
    fetch("https://api.sampleapis.com/movies/animation")
      .then(res => res.json())
      .then(data => {
        const peliculas = data.slice(0, 10);
        const contenedor = document.getElementById("peliculas-container");
        contenedor.innerHTML = peliculas.map(f => `<div><strong>${f.title}</strong> (${f.year || 'sin año'})</div>`).join("");
        document.getElementById("api1-content").style.display = "none";
        document.getElementById("api2-content").style.display = "block";
      })
      .catch(err => {
        console.error("Error al cargar películas:", err);
      });
  }
  