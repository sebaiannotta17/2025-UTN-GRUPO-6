function mostrarFrase(frases) {
  const divPrin = document.querySelector(".contenido_principal");
  divPrin.classList.add("oculto");

  const numero = Math.floor(Math.random() * frases.length);

  let fraseSeleccion = frases[numero];
  let frase = document.getElementById("frase");
  frase.innerHTML = fraseSeleccion;
}

function formatearEstructura() {
  document.querySelector(".pagina_inicio").style.display = "none";
  const divPrin = document.querySelector(".contenido_principal");
  divPrin.classList.add("activo");
  divPrin.innerHTML = "";
}

function crearPokemon(data) {
  const tarjeta = document.createElement("div");
  tarjeta.classList.add("tarjeta");

  const imagen = document.createElement("img");
  imagen.src = data.sprites.front_default;

  const nombre = document.createElement("h2");
  nombre.textContent = "Nombre del pokemon: " + data.name;

  const numero = document.createElement("p");
  numero.textContent = "Numero del pokemon: #" + data.id;

  const habilidades = document.createElement("p");
  habilidades.innerHTML = "<span>Habilidades:</span> <br>";
  for (let i = 0; i < data.abilities.length; i++) {
    habilidades.innerHTML +=
      `Habilidad ${i + 1}: ` + data.abilities[i].ability.name + " <br> ";
  }

  const tipos = document.createElement("p");
  tipos.innerHTML = "<span>Tipos:</span> <br>";
  for (let i = 0; i < data.types.length; i++) {
    tipos.innerHTML += `Tipo ${i + 1}: ` + data.types[i].type.name + " <br> ";
  }

  tarjeta.appendChild(imagen);
  tarjeta.appendChild(nombre);
  tarjeta.appendChild(numero);
  tarjeta.appendChild(habilidades);
  tarjeta.appendChild(tipos);

  return tarjeta;
}

function consumirApiPokemones() {
  let link = document.querySelector(".pokemones");

  link.addEventListener("click", (event) => {
    event.preventDefault();
    formatearEstructura();

    const urls = [
      "https://pokeapi.co/api/v2/pokemon/luxray",
      "https://pokeapi.co/api/v2/pokemon/snorlax",
      "https://pokeapi.co/api/v2/pokemon/lucario",
      "https://pokeapi.co/api/v2/pokemon/blastoise",
      "https://pokeapi.co/api/v2/pokemon/gyarados"
    ];

    Promise.all(urls.map((url) => fetch(url).then((res) => res.json()))).then(
      (pokemones) => {
        pokemones.forEach((pokemon) => {
          const tarjeta = crearPokemon(pokemon);
          document.querySelector(".contenido_principal").appendChild(tarjeta);
        });
      }
    );
  });
}

function crearPelicula(data) {
  const tarjeta = document.createElement("div");
  tarjeta.classList.add("tarjeta");

  const imagen = document.createElement("img");
  imagen.src = "https://image.tmdb.org/t/p/w500" + data.poster_path;

  const nombre = document.createElement("h2");
  nombre.textContent = "Nombre: " + data.title;

  const descripcion = document.createElement("p");
  descripcion.innerHTML = "<span>Descripcion:</span> " + data.overview;

  tarjeta.appendChild(imagen);
  tarjeta.appendChild(nombre);
  tarjeta.appendChild(descripcion);

  return tarjeta;
}

function obtenerOpciones() {
  // Puedes crear dinámicamente el objeto 'options' aquí si es necesario
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmMzM3NmExMzMwMjQyZWU0ZTExMDhhZDAyY2EwNWYzNSIsIm5iZiI6MTc0NTYwODEwOS4wMDEsInN1YiI6IjY4MGJkZGFjMjcxZWNiM2FlMDhhOTJlYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.8bncoI2ht26BFDcIEoOEhsoE_6QcwObIpcWptj96MCQ",
    },
  };

  return options;
}

function consumirApiPeliculas() {
  let link = document.querySelector(".peliculas_series");

  link.addEventListener("click", (event) => {
    event.preventDefault();
    formatearEstructura();

    const options = obtenerOpciones();

    fetch(
      "https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc",
      options
    )
      .then((res) => res.json())
      .then((data) =>
        data.results.slice(0, 5).forEach((pelicula) => {
          const tarjeta = crearPelicula(pelicula);
          document.querySelector(".contenido_principal").appendChild(tarjeta);
        })
      )
      .catch((err) => console.error(err));
  });
}

function vincularImagen(data) {
  let icono = document.createElement("img");
  switch (data) {
    case "Thunderstorm":
      icono.src = "./recursos/animated/thunder.svg";
      break;
    case "Drizzle":
      icono.src = "./recursos/animated/rainy-2.svg";
      break;
    case "Rain":
      icono.src = "./recursos/animated/rainy-7.svg";
      break;
    case "Snow":
      icono.src = "./recursos/animated/snowy-6.svg";
      break;
    case "Clear":
      icono.src = "./recursos/animated/day.svg";
      break;
    case "Atmosphere":
      icono.src = "./recursos/animated/weather.svg";
      break;
    case "Clouds":
      icono.src = "./recursos/animated/cloudy-day-1.svg";
      break;
    default:
      icono.src = "./recursos/animated/cloudy-day-1.svg";
  }

  return icono;
}

function crearClima(data) {
  const caja = document.createElement("div");
  caja.classList.add("activo");

  const tarjeta1 = document.createElement("div");
  tarjeta1.classList.add("tarjeta1");

  const temperatura = document.createElement("h2");
  temperatura.innerText = Math.round(data.main.temp - 273.15) + "°";
  const descripcion = document.createElement("p");
  descripcion.innerText = data.weather[0].description;

  tarjeta1.appendChild(temperatura);
  tarjeta1.appendChild(descripcion);

  const tarjeta2 = document.createElement("div");
  tarjeta2.classList.add("tarjeta2");

  const ubicacion = document.createElement("h2");
  ubicacion.innerText = data.name;
  const imagen = vincularImagen(data.weather[0].main);

  tarjeta2.appendChild(ubicacion);
  tarjeta2.appendChild(imagen);

  const tarjeta3 = document.createElement("div");
  tarjeta3.classList.add("tarjeta3");

  const titulo = document.createElement("h2");
  titulo.innerText = "Velocidad del viento";
  const velocidad = document.createElement("h1");
  velocidad.innerText = data.wind.speed;

  tarjeta3.appendChild(titulo);
  tarjeta3.appendChild(velocidad);

  caja.appendChild(tarjeta1);
  caja.appendChild(tarjeta2);
  caja.appendChild(tarjeta3);

  return caja;
}

function consumirApiClima() {
  let link = document.querySelector(".clima");

  link.addEventListener("click", (event) => {
    event.preventDefault();
    formatearEstructura();

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (posicion) => {
          let lon = posicion.coords.longitude;
          console.log(lon);
          let lat = posicion.coords.latitude;
          console.log(lat);

          const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=ee77bff38f73a46836bd5a0e65f3a0bb`;

          fetch(url)
            .then((response) => response.json())
            .then((data) => {
              const caja = crearClima(data);
              console.log(data);
              document.querySelector(".contenido_principal").appendChild(caja);
            });
        },
        (error) => {
          console.error("Error obteniendo ubicación", error);
        }
      );
    }
  });
}

const frases = [
  "La vida es un viaje, no un destino.",
  "El conocimiento es poder.",
  "La creatividad es la inteligencia divirtiéndose.",
];

mostrarFrase(frases);
consumirApiPokemones();
consumirApiPeliculas();
consumirApiClima();
