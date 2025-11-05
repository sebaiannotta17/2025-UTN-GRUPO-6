document.addEventListener("DOMContentLoaded", async () => {
  const form = document.getElementById("searchForm");
  const input = document.getElementById("q");
  const resultsContainer = document.getElementById("results");
  const sortFilter = document.getElementById("sortFilter");
  const API_URL = "http://localhost:3000/api/busqueda";

  // paginacion
  let resultados = [];
  let currentPage = 1;
  const pageSize = 9;//determina cuantas publicaciones muestra por pagina

  // Pagination control elements
  const prevBtn = document.getElementById("prevPage");
  const nextBtn = document.getElementById("nextPage");
  const pageInfo = document.getElementById("pageInfo");

  // lee los parametros en la url
  const params = new URLSearchParams(window.location.search);
  const initialQuery = params.get("q") || "";

  if (initialQuery) {
    input.value = initialQuery;
    input.focus();
    await buscar(initialQuery);
  } else {
    input.focus();
  }

  // Evento al enviar el formulario
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const query = input.value.trim();
    if (!query) return;
    await buscar(query);
  });

  // Evento al cambiar el filtro de ordenamiento
  if (sortFilter) {
    sortFilter.addEventListener("change", () => {
      currentPage = 1; // Reset to first page on sort change
      renderResultados();
    });
  }

  // botones de pagina
  if (prevBtn && nextBtn) {
    prevBtn.addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--;
        renderResultados();
      }
    });
    nextBtn.addEventListener("click", () => {
      if (currentPage < Math.ceil(resultados.length / pageSize)) {
        currentPage++;
        renderResultados();
      }
    });
  }
//realiza la busqueda y lo guarda en el arreglo global resultados
  async function buscar(query) {
    resultsContainer.innerHTML = "";
    resultados = [];
    currentPage = 1;

    try {
      const res = await fetch(`${API_URL}?q=${encodeURIComponent(query)}`);
      const data = await res.json();

      if (!res.ok) {
        resultsContainer.innerHTML = `<p class="error">${data.error}</p>`;
        return;
      }

      if (!data.results || data.results.length === 0) {
        resultsContainer.innerHTML = `<p>No se encontraron publicaciones.</p>`;
        return;
      }

      resultados = data.results.slice(); // guarda los resultados
      renderResultados(); // renderiza (incluyendo paginación y orden)
    } catch (err) {
      console.error(err);
      resultsContainer.innerHTML = `<p class="error">Error al conectar con el servidor.</p>`;
    }
  }

  // ordena y muestra los resultados
  function renderResultados() {
    resultsContainer.innerHTML = "";

    let resultsToRender = resultados.slice();
    const criterio = sortFilter ? sortFilter.value : "default";

    switch (criterio) {
      case "titulo-asc":
        resultsToRender.sort((a, b) => a.titulo.localeCompare(b.titulo));
        break;
      case "titulo-desc":
        resultsToRender.sort((a, b) => b.titulo.localeCompare(a.titulo));
        break;
      case "precio-asc":
        resultsToRender.sort((a, b) => (a.precio || 0) - (b.precio || 0));
        break;
      case "precio-desc":
        resultsToRender.sort((a, b) => (b.precio || 0) - (a.precio || 0));
        break;
      default:
        // No sorting
        break;
    }

    // controles para la paginacion
    const totalPages = Math.ceil(resultsToRender.length / pageSize);
    const startIdx = (currentPage - 1) * pageSize;
    const endIdx = Math.min(startIdx + pageSize, resultsToRender.length);
    const pagedResults = resultsToRender.slice(startIdx, endIdx);

    if (pagedResults.length === 0) {
      resultsContainer.innerHTML = `<p>No se encontraron publicaciones.</p>`;
    } else {
      pagedResults.forEach((pub) => {
        const li = document.createElement("li");
        li.classList.add("material-card");
        li.innerHTML = `
          <img src="${pub.imagen || "../img/default.png"}" alt="${pub.titulo}">
          <div class="material-info">
            <h3>${pub.titulo}</h3>
            <p>${pub.descripcion || ""}</p>
            <p><strong>Precio:</strong> $${pub.precio}</p>
            <p><strong>Cantidad:</strong> ${pub.cantidad}</p>
          </div>
        `;
        resultsContainer.appendChild(li);
      });
    }

    // actualiza controles de paginacion
    if (pageInfo) pageInfo.textContent = `Página ${currentPage} de ${totalPages || 1}`;
    if (prevBtn) prevBtn.disabled = currentPage === 1;
    if (nextBtn) nextBtn.disabled = currentPage === totalPages || totalPages === 0;
  }
});
