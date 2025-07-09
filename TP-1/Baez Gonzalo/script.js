async function cargarAPI1() {
  const contenido = document.getElementById("contenido");
  contenido.innerHTML = "<p>Cargando usuarios...</p>";

  try {
    const respuesta = await fetch("https://jsonplaceholder.typicode.com/users");
    if (!respuesta.ok) {
      throw new Error(`Error en la solicitud: ${respuesta.status}`);
    }
    const usuarios = await respuesta.json();

    // Crear una lista de usuarios
    const lista = document.createElement("ul");
    usuarios.forEach((usuario) => {
      const item = document.createElement("li");
      item.textContent = `${usuario.name} (${usuario.email})`;
      lista.appendChild(item);
    });

    contenido.innerHTML = "<h3>Usuarios:</h3>";
    contenido.appendChild(lista);
  } catch (error) {
    contenido.innerHTML = `<p>Error al cargar los usuarios: ${error.message}</p>`;
  }
}

async function cargarAPI2() {
  const contenido = document.getElementById("contenido");
  contenido.innerHTML = "<p>Cargando deportes...</p>";

  try {
    const respuesta = await fetch(
      "https://www.thesportsdb.com/api/v1/json/1/all_sports.php"
    );
    if (!respuesta.ok) {
      throw new Error(`Error en la solicitud: ${respuesta.status}`);
    }
    const data = await respuesta.json();

    // Mostrar el primer 5 deportes como ejemplo
    const deportes = data.sports.slice(0, 5);

    contenido.innerHTML = "<h3>Lista de Deportes:</h3>";

    deportes.forEach((deporte) => {
      const contenedor = document.createElement("div");
      contenedor.style.marginBottom = "20px";

      const nombre = document.createElement("h4");
      nombre.textContent = deporte.strSport;

      const imagen = document.createElement("img");
      imagen.src = deporte.strSportThumb;
      imagen.alt = deporte.strSport;
      imagen.style.width = "100px";

      const descripcion = document.createElement("p");
      descripcion.textContent =
        deporte.strSportDescription.substring(0, 150) + "..."; // Un pedacito

      contenedor.appendChild(nombre);
      contenedor.appendChild(imagen);
      contenedor.appendChild(descripcion);

      contenido.appendChild(contenedor);
    });
  } catch (error) {
    contenido.innerHTML = `<p>Error al cargar los deportes: ${error.message}</p>`;
  }
}

async function cargarAPI3() {
  const contenido = document.getElementById("contenido");
  contenido.innerHTML = "<p>Cargando países...</p>";

  try {
    const respuesta = await fetch("https://restcountries.com/v3.1/all");
    if (!respuesta.ok) {
      throw new Error(`Error en la solicitud: ${respuesta.status}`);
    }
    const data = await respuesta.json();

    const paises = data.slice(0, 36); // 6x6 = 36 países

    const grid = document.createElement("div");
    grid.className = "grid-paises";

    paises.forEach((pais) => {
      const card = document.createElement("div");
      card.className = "card-pais";

      const nombre = document.createElement("h4");
      nombre.textContent = pais.name.common;

      const imagen = document.createElement("img");
      imagen.src = pais.flags.png;
      imagen.alt = `Bandera de ${pais.name.common}`;
      imagen.style.width = "80px";
      imagen.style.height = "auto";

      const continente = document.createElement("p");
      continente.textContent = `Continente: ${pais.region}`;

      card.appendChild(nombre);
      card.appendChild(imagen);
      card.appendChild(continente);

      grid.appendChild(card);
    });

    contenido.innerHTML = "<h3>Países del mundo:</h3>";
    contenido.appendChild(grid);
  } catch (error) {
    contenido.innerHTML = `<p>Error al cargar los países: ${error.message}</p>`;
  }
}
