async function cargarPelicula() {
    try {
        const res = await fetch("http://localhost:3000/cargar-matrix");
        const data = await res.json();
        document.getElementById("resultado").innerHTML = `
          <p class="text-success">Película cargada correctamente.</p>
        `;
    } catch (err) {
        document.getElementById("resultado").innerHTML = `
          <p class="text-danger">Error al cargar la pelicula.</p>
        `;
    }
}

async function recuperarPeliculas() {
    try {
        const res = await fetch("http://localhost:3000/recuperar-matrix");
        const data = await res.json();
        const etiquetasGeneros = data.generos.map(genero => `
  <span class="badge rounded-pill bg-secondary me-1">${genero}</span>
`).join("");

        const cardInfo = `
          <div class="card mb-3">
            <div class="card-body">
              <h5 class="card-title">${data.nombre}</h5>
              <p class="card-text"><strong>Estreno:</strong> ${data.estreno}</p>
              <p class="card-text"><strong>Recaudacion:</strong> ${data.recaudacion}</p>
              <p class="card-text"><strong>Géneros:</strong> ${etiquetasGeneros}</p>

            </div>
          </div>
        `;

        const carouselItems = data.g_6_companias.map((prod, index) => `
          <div class="carousel-item ${index === 0 ? 'active' : ''}">
            <div class="d-flex flex-column align-items-center p-3">
              <img src="${prod.logo}" class="d-block" alt="${prod.nombre}" style="max-height: 150px;">
              <p class="mt-2">${prod.nombre}</p>
            </div>
          </div>
        `).join("");

        const cardCarrusel = `
          <div class="card">
            <div class="card-header">Compañías productoras</div>
            <div class="card-body">
              <div id="carruselProductoras" class="carousel slide" data-bs-ride="carousel">
                <div class="carousel-inner">
                  ${carouselItems}
                </div>
                <button class="carousel-control-prev" type="button" data-bs-target="#carruselProductoras" data-bs-slide="prev">
                  <span class="carousel-control-prev-icon"></span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#carruselProductoras" data-bs-slide="next">
                  <span class="carousel-control-next-icon"></span>
                </button>
              </div>
            </div>
          </div>
        `;


        document.getElementById("resultado").innerHTML = cardInfo + cardCarrusel;
    } catch (err) {
        document.getElementById("resultado").innerText = "Error al recuperar películas: " + err.message;
    }
}