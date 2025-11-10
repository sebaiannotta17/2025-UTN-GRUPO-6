document.addEventListener("DOMContentLoaded", () => {
  // =============================
  // 1) Continuidad búsqueda (header)
  // =============================
  const form  = document.getElementById("search-form");
  const input = document.getElementById("search-input");

  if (form && input) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const query = (input.value || "").trim();
      if (!query) return;
      window.location.href = `./busqueda.html?q=${encodeURIComponent(query)}`;
    });
  }

  // =============================
  // 2) Botón Login / Mi Perfil / Favoritos
  // =============================
  const $navLoginBtn  = document.getElementById("nav-login-btn");
  const $navPerfilBtn = document.getElementById("nav-perfil-btn");
  const $navLogoutBtn = document.getElementById("nav-logout-btn");
  const usuario = safeParse(localStorage.getItem("user"));

  // Inicializar favoritos y carrito
  FavoritosManager.init(usuario);
  CarritoManager.init(usuario);

  if (usuario && usuario.id) {
    if ($navLoginBtn)  $navLoginBtn.style.display  = "none";
    if ($navPerfilBtn) $navPerfilBtn.style.display = "inline-block";
    if ($navLogoutBtn) $navLogoutBtn.style.display = "inline-block";
  } else {
    if ($navLoginBtn)  $navLoginBtn.style.display  = "inline-block";
    if ($navPerfilBtn) $navPerfilBtn.style.display = "none";
    if ($navLogoutBtn) $navLogoutBtn.style.display = "none";
  }

  // Logout rápido desde el header
  if ($navLogoutBtn) {
    $navLogoutBtn.addEventListener('click', () => {
      localStorage.removeItem('user');
      // volver a la página principal y refrescar estado
      window.location.href = './main.html';
    });
  }

  // =============================
  // 3) Publicaciones recientes
  // =============================
  const API_BASE = `${location.origin}/api`;
  const $homeGrid = document.getElementById("home-grid");
  const $homeFeedback = document.getElementById("home-feedback");

  if ($homeGrid) {
    const qs = new URLSearchParams();
    qs.set("limit", "8");
    // Siempre pedimos las publicaciones más recientes del sistema
    cargarRecientes(qs.toString());
  }

  async function cargarRecientes(queryString) {
    try {
      if ($homeFeedback) $homeFeedback.textContent = "Cargando publicaciones...";
      const url = `${API_BASE}/publicaciones/recientes?${queryString}`;
      const res = await fetch(url, { cache: "no-store" });

      if (!res.ok) {
        const t = await res.text().catch(() => "");
        throw new Error(`HTTP ${res.status} - ${t}`);
      }

      const pubs = await res.json();

      if (!Array.isArray(pubs) || pubs.length === 0) {
        if ($homeFeedback) {
          $homeFeedback.textContent = usuario?.id
            ? "Todavía no publicaste nada."
            : "No hay publicaciones recientes.";
        }
        return;
      }

      if ($homeFeedback) $homeFeedback.remove();
      $homeGrid.innerHTML = pubs.map(cardHTMLPerfilStyle).join("");

      // Event listeners para botones
      $homeGrid.addEventListener("click", handleGridClick);

    } catch (err) {
      console.error("[recientes][error]", err);
      if ($homeFeedback) $homeFeedback.textContent = "No se pudieron cargar las publicaciones.";
      else if ($homeGrid) $homeGrid.innerHTML = `<li class="error">Error al cargar publicaciones.</li>`;
    }
  }

  // Manejar clicks en el grid (ver publicación y favoritos)
  function handleGridClick(e) {
    // Botón ver publicación
    const btnView = e.target.closest(".btn-view-pub");
    if (btnView) {
      const titulo = btnView.dataset.titulo || "";
      window.location.href = `./busqueda.html?q=${encodeURIComponent(titulo)}`;
      return;
    }

    // Manejar click en favorito
    FavoritosManager.handleFavoritoClick(e);
  }

  // --- tarjeta con el MISMO layout/clases que Perfil ---
  function cardHTMLPerfilStyle(m) {
    const imgHtml = m.imagen
      ? `<img src="${escapeHTML(m.imagen)}" alt="${escapeHTML(m.titulo || "Publicación")}" class="publicacion-img" />`
      : "";

    // Formatear fecha
    let fechaText = "";
    if (m.fecha_publicacion) {
      try {
        const d = new Date(m.fecha_publicacion);
        fechaText = d.toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' });
      } catch (e) {
        fechaText = m.fecha_publicacion;
      }
    }

    // cantidad
    const cantidad = (m.cantidad !== undefined && m.cantidad !== null) ? String(m.cantidad) : "0";

    return `
      <li class="publicacion-card">
        ${imgHtml}
        <div class="card-content">
          <h3>${escapeHTML(m.titulo || "Sin título")}</h3>
          <p class="muted">${escapeHTML(m.descripcion || "Sin descripción.")}</p>
          <p class="card-price"><strong>${fmtCurrency(m.precio)}</strong></p>
          <p class="card-meta"><span class="qty">Cantidad: ${escapeHTML(cantidad)}</span><span class="date">${escapeHTML(fechaText)}</span></p>
        </div>
        <div class="publicacion-actions">
          <button class="btn btn-primary btn-view-pub"
                  data-id="${m.id}"
                  data-titulo="${escapeHTML(m.titulo || "")}">
            Ver detalle
          </button>
          ${FavoritosManager.agregarBotonFavorito(m)}
        </div>
      </li>
    `;
  }

  // Cargar estados de favoritos después de cargar publicaciones
  if (usuario && usuario.id && $homeGrid) {
    // Observar cuando se agreguen nuevos elementos al grid
    const observer = new MutationObserver(() => {
      FavoritosManager.cargarEstadosFavoritos();
    });
    observer.observe($homeGrid, { childList: true });
  }

  // =============================
  // Helpers
  // =============================
  function escapeHTML(s) {
    return String(s ?? "")
      .replaceAll("&","&amp;")
      .replaceAll("<","&lt;")
      .replaceAll(">","&gt;")
      .replaceAll('"',"&quot;")
      .replaceAll("'","&#39;");
  }

  function fmtCurrency(n) {
    const v = Number.isFinite(+n) ? +n : 0;
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0
    }).format(v);
  }

  function safeParse(str) {
    try { return JSON.parse(str || "null"); } catch { return null; }
  }
});