document.addEventListener("DOMContentLoaded", async () => {
  const API_BASE = "http://localhost:3000/api";
  const form = document.getElementById("searchForm");
  const input = document.getElementById("q");
  const resultsContainer = document.getElementById("results");
  const sortFilter = document.getElementById("sortFilter");

  // Paginación
  let resultados = [];
  let currentPage = 1;
  const pageSize = 9;

  const prevBtn = document.getElementById("prevPage");
  const nextBtn = document.getElementById("nextPage");
  const pageInfo = document.getElementById("pageInfo");

  // Modal refs
  const $modal = document.getElementById("materialModal");
  const $mImg = document.querySelector("#mThumb img");
  const $mName = document.getElementById("mName");
  const $mDesc = document.getElementById("mDesc");
  const $mLong = document.getElementById("mLongDesc");
  const $mPrice = document.getElementById("mPrice");
  const $mCat = document.getElementById("mCategory");
  const $mQty = document.getElementById("mQty");
  const $mDetails = document.getElementById("mDetails");

  // Lee parámetros iniciales
  const params = new URLSearchParams(window.location.search);
  const initialQuery = params.get("q") || "";

  if (initialQuery) {
    input.value = initialQuery;
    input.focus();
    await buscar(initialQuery);
  } else {
    input.focus();
  }

  // Buscar al enviar formulario
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const query = input.value.trim();
    if (!query) return;
    await buscar(query);
  });

  // Cambio de filtro
  if (sortFilter) {
    sortFilter.addEventListener("change", () => {
      currentPage = 1;
      renderResultados();
    });
  }

  // Botones de página
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

  // Realiza búsqueda y guarda resultados
  async function buscar(query) {
    resultsContainer.innerHTML = "";
    resultados = [];
    currentPage = 1;

    try {
      const res = await fetch(`${API_BASE}/busqueda?q=${encodeURIComponent(query)}`, { cache: "no-store" });
      const data = await res.json();

      if (!res.ok) {
        resultsContainer.innerHTML = `<p class="error">${data.error}</p>`;
        return;
      }

      if (!data.results || data.results.length === 0) {
        resultsContainer.innerHTML = `<p>No se encontraron publicaciones.</p>`;
        return;
      }

      resultados = data.results.slice();
      renderResultados();
    } catch (err) {
      console.error(err);
      resultsContainer.innerHTML = `<p class="error">Error al conectar con el servidor.</p>`;
    }
  }

  // Renderiza los resultados paginados y ordenados
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
        break;
    }

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
        li.dataset.id = pub.id;
        li.innerHTML = `
          <div class="card-thumb">
            <img src="${pub.imagen || "../img/default.png"}" alt="${pub.titulo}">
          </div>
          <div class="card-info">
            <h3>${pub.titulo}</h3>
            <p class="muted">${pub.descripcion || ""}</p>
            <div class="card-price">$${pub.precio ?? 0}</div>
            <button class="btn btn-small btn-primary ver-detalle" data-id="${pub.id}">Ver detalle</button>
          </div>
        `;
        resultsContainer.appendChild(li);
      });
    }

    if (pageInfo) pageInfo.textContent = `Página ${currentPage} de ${totalPages || 1}`;
    if (prevBtn) prevBtn.disabled = currentPage === 1;
    if (nextBtn) nextBtn.disabled = currentPage === totalPages || totalPages === 0;
  }

  // Delegación de eventos para abrir modal
  resultsContainer.addEventListener("click", async (e) => {
    const btn = e.target.closest(".ver-detalle");
    if (!btn) return;
    const id = parseInt(btn.dataset.id);
    await openModal(id);
  });

  // Abrir modal (detalle)
  async function openModal(id) {
    let pub = null;

    try {
      const r = await fetch(`${API_BASE}/publicaciones/${id}`, { cache: "no-store" });
      if (r.ok) {
        pub = await r.json();
      }
    } catch (_) {
      /* fallback */
    }

    if (!pub) pub = resultados.find((x) => x.id === id);

    if (!pub) {
      alert("No se pudo cargar el detalle de la publicación.");
      return;
    }

    $mImg.src = pub.imagen || "../img/default.png";
    $mImg.alt = pub.titulo || "Material";
    $mName.textContent = pub.titulo || "Sin título";
    $mDesc.textContent = pub.descripcion || "";
    $mLong.textContent = pub.descripcion_larga || "";
    $mPrice.textContent = `$${pub.precio ?? 0}`;
    $mCat.textContent = pub.categoria_nombre || pub.categoria_id || "—";
    $mQty.textContent = `${pub.cantidad ?? 0} unidades`;

    const extra = [];
    if (pub.fecha_publicacion) {
      let fechaText = pub.fecha_publicacion;
      try {
        const d = new Date(pub.fecha_publicacion);
        fechaText = d.toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' });
      } catch (e) {
        // leave original
      }
      extra.push(`<li>Publicada: ${fechaText}</li>`);
    }
    if (pub.vendedor_nombre) extra.push(`<li>Vendedor: ${pub.vendedor_nombre}</li>`);
    if (pub.vendedor_email) extra.push(`<li>Contacto: ${pub.vendedor_email}</li>`);
    $mDetails.innerHTML = extra.join("") || "<li>Sin datos adicionales</li>";

    $modal.setAttribute("aria-hidden", "false");
  }

  // Cerrar modal
  document.querySelectorAll('[data-close="1"]').forEach((el) =>
    el.addEventListener("click", () => $modal.setAttribute("aria-hidden", "true"))
  );

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") $modal.setAttribute("aria-hidden", "true");
  });
});
