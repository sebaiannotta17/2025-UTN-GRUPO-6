async function cargarPelicula() {
  try {
    const res = await fetch("http://localhost:3000/cargar-matrix");
    const data = await res.json();
    document.getElementById("resultado").innerHTML = `
      <p class="text-success centrar">Película cargada correctamente.</p>
    `;
  } catch (err) {
    document.getElementById("resultado").innerHTML = `
      <p class="text-danger centrar">Error al cargar la película.</p>
    `;
  }
}

function calcularAniosDesdeEstreno(fechaEstreno) {
  const hoy = new Date();
  const estreno = new Date(fechaEstreno);
  let años = hoy.getFullYear() - estreno.getFullYear();

  const yaPasoElMesYDia =
    hoy.getMonth() > estreno.getMonth() ||
    (hoy.getMonth() === estreno.getMonth() &&
      hoy.getDate() >= estreno.getDate());

  if (!yaPasoElMesYDia) años--;

  return años;
}

async function recuperarPeliculas() {
  try {
    const res = await fetch("http://localhost:3000/recuperar-matrix");
    const result = await res.json();
    const peliculaRaw = result.data.data[1];

    //  Géneros
    const etiquetasGeneros = peliculaRaw.g_6_generos
      .map(
        (genero) => `
        <span class="badge rounded-pill bg-secondary me-1">${genero.nombre}</span>
      `
      )
      .join("");

    //  Info principal de la película
    const cardInfo = `
      <div class="col-md-6 d-flex">
        <div class="card mb-3 w-100 h-100">
          <div class="card-body">
            <h5 class="card-title">${peliculaRaw.nombre}</h5>
            <p class="card-text"><strong>Estreno:</strong> ${peliculaRaw.estreno}</p>
            <p class="card-text"><strong>Recaudación:</strong> ${peliculaRaw.recaudacion}</p>
            <p class="card-text"><strong>Géneros:</strong> ${etiquetasGeneros}</p>
          </div>
        </div>
      </div>
    `;

    //  KPI Card
    const cardKpi = `
       <div class="col-md-6 d-flex">
        <div class="card mb-3 w-100 h-100 text-dark">
          <div class="card-body">
            <h5 class="card-title">Lanzada hace</h5>
            <p class="card-text">${calcularAniosDesdeEstreno(
              peliculaRaw.estreno
            )} años</p>
            <h5 class="card-title">Cantidad de compañías participantes</h5>
            <p class="card-text">${peliculaRaw.g_6_companias.length}</p>
            <h5 class="card-title">Cantidad de géneros</h5>
            <p class="card-text">${peliculaRaw.g_6_generos.length}</p>
          </div>
        </div>
      </div>
    `;

    //  Carrusel de compañías
    const companias = peliculaRaw.g_6_companias;

    const carouselItems = companias
      .map((compania, index) => {
        const nombre = compania.nombre;
        const logoURL = compania.logo ? compania.logo : null;

        const imgTag = logoURL
          ? `<img src="https://image.tmdb.org/t/p/w154/${logoURL}" class="d-block mb-3" alt="${nombre}" style="max-height: 150px;">`
          : `<div class="text-muted">Sin logo</div>`;

        return `
          <div class="carousel-item ${index === 0 ? "active" : ""}">
            <div class="d-flex flex-column align-items-center justify-content-center p-3">
              <div id="logo" class="text-center">${imgTag}</div>
              <p class="mt-3">${nombre}</p>
            </div>
          </div>
        `;
      })
      .join("");

    const cardCarrusel = `
      <div class="card card-body mt-4">
        <h3 class="d-flex jutify-content-center justify-content-md-start ps-2 pt-2 mb-4">Compañías Productoras</h3>
        <div id="carouselExampleControls" class="carousel slide" data-bs-ride="carousel">
          <div class="carousel-inner">
            ${carouselItems}
          </div>
          <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Previous</span>
          </button>
          <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Next</span>
          </button>
        </div>
      </div>
    `;

    // Render final
    document.getElementById("resultado").innerHTML = `
      <div class="row gx-3 gy-4">
        ${cardInfo}
        ${cardKpi}
      </div>
      ${cardCarrusel}
    `;
  } catch (err) {
    document.getElementById("resultado").innerHTML =`
      <p class="centrar">Error al recuperar películas: ${err.message};</p>
      `
  }
}
