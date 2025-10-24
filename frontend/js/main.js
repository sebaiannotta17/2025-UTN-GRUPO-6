document.addEventListener("DOMContentLoaded", () => {
  const USE_MOCK = true;
  const API_URL = "http://localhost:3000/api/materials";

  const MOCK_LOCAL = [
    {
      id: 1,
      name: "Cemento Portland",
      desc: "Bolsa 50kg",
      descripcion: "Cemento de uso general para estructuras y albañilería.",
      price: 9500,
      category: "Materiales",
      qty: 1,
      image_url:
        "https://images.unsplash.com/photo-1581091215367-59ab6d104511?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: 2,
      name: "Arena fina",
      desc: "m³",
      descripcion: "Arena lavada para revoques finos y terminaciones.",
      price: 18000,
      category: "Áridos",
      qty: 1,
      image_url:
        "https://images.unsplash.com/photo-1566404791238-8c9a9a0f0b11?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: 3,
      name: "Hierro 8mm",
      desc: "Barra 12m",
      descripcion: "Varilla de acero ADN 420 para armaduras de hormigón.",
      price: 11000,
      category: "Acero",
      qty: 1,
      image_url:
        "https://images.unsplash.com/photo-1563371351-e53ebb744a1a?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: 12,
      name: "Pintura látex interior",
      desc: "Bal. 20L",
      descripcion: "Acabado mate, lavable, bajo olor.",
      price: 65000,
      category: "Pinturas",
      qty: 1,
      image_url:
        "https://images.unsplash.com/photo-1582582429416-0ef7f5a1d3a1?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: 6,
      name: "Ladrillo común",
      desc: "Unidad",
      descripcion: "Ladrillo cerámico macizo para muros portantes.",
      price: 350,
      category: "Ladrillos",
      qty: 50,
      image_url:
        "https://images.unsplash.com/photo-1606229365485-93a3aa54be4d?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: 7,
      name: 'PVC 3/4"',
      desc: "Tubo 6m",
      descripcion: "Tubería de PVC para agua fría, presión PN10.",
      price: 2900,
      category: "Plomería",
      qty: 5,
      image_url:
        "https://images.unsplash.com/photo-1600861194942-ed7b0e2f24b8?q=80&w=1200&auto=format&fit=crop",
    },
  ];

  const $ = (sel) => document.querySelector(sel);
  function escapeHtml(s = "") {
    return s.replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
  }
  function formatAr(n) {
    const x = Number(n);
    return Number.isFinite(x) ? x.toLocaleString("es-AR") : "-";
  }
  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  const $searchForm = $("#search-form");
  const $searchInput = $("#search-input");
  if ($searchForm) {
    $searchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const q = ($searchInput?.value || "").trim();
      const url = "./busqueda.html" + (q ? `?q=${encodeURIComponent(q)}` : "");
      location.href = url;
    });
  }

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const $actions = document.querySelector(".header-actions");
  if ($actions) {
    const $loginBtn = $actions.querySelector('a[href="./login.html"]');
    const $publicarBtn = $actions.querySelector('a[href="./carga.html"]');

    if ($publicarBtn) {
      $publicarBtn.addEventListener("click", (e) => {
        e.preventDefault();
        if (!user) {
          alert("Tenés que iniciar sesión para publicar.");
          location.href = "./login.html";
        } else {
          location.href = "./carga.html";
        }
      });
    }

    if (user && $loginBtn) {
      $loginBtn.textContent = "Mi cuenta";
      $loginBtn.setAttribute("href", "./perfil.html");

      const logout = document.createElement("a");
      logout.href = "#";
      logout.className = "btn btn-secondary";
      logout.textContent = "Salir";
      logout.style.marginLeft = "8px";
      logout.addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        location.href = "./login.html";
      });
      $actions.appendChild(logout);
    }
  }

  // --- Home destacados ---
  const $homeFeedback = $("#home-feedback");
  const $homeGrid = $("#home-grid");

  function enrichWithImages(arr) {
    const byName = new Map(
      MOCK_LOCAL.map((x) => [String(x.name || "").toLowerCase(), x.image_url]),
    );
    return arr.map((m) => {
      const url = (m.image_url ?? m.imageUrl ?? "").toString().trim();
      if (url) return m;
      const fromMock = byName.get(String(m.name || "").toLowerCase());
      return fromMock ? { ...m, image_url: fromMock } : m;
    });
  }

  function renderHome(items) {
    if (!$homeGrid || !$homeFeedback) return;
    if (!items.length) {
      $homeFeedback.textContent = "No hay materiales para mostrar";
      $homeGrid.innerHTML = "";
      return;
    }
    $homeFeedback.textContent = `Recomendados (${items.length})`;
    $homeGrid.innerHTML = items
      .map((m, i) => {
        const url = (m.image_url ?? m.imageUrl ?? "").toString().trim();
        const name = escapeHtml(m.name ?? "—");
        const desc = escapeHtml((m.desc ?? m.descripcion ?? "").toString());
        const price = `$${formatAr(m.price)}`;
        const ini = (name[0] || "").toUpperCase();

        const thumb = url
          ? `<img class="thumb-img" src="${escapeHtml(url)}" alt="${name}" loading="lazy" decoding="async">`
          : `<div class="thumb" data-initial="${escapeHtml(ini)}"></div>`;

        return `
          <li class="card" data-idx="${i}">
            ${thumb}
            <h3>${name}</h3>
            <p class="muted">${desc}</p>
            <div class="price">${price}</div>
          </li>
        `;
      })
      .join("");
  }

  async function loadHomeRandom(n = 8) {
    try {
      if (!USE_MOCK) {
        const res = await fetch(`${API_URL}`);
        const data = await res.json();
        const arr = Array.isArray(data) ? data : (data.items ?? []);
        const enriched = enrichWithImages(arr);
        renderHome(shuffle(enriched).slice(0, n));
        return;
      }
    } catch (e) {
      console.warn("API materials error, fallback MOCK:", e);
    }
    renderHome(shuffle(MOCK_LOCAL).slice(0, n));
  }

  if ($homeGrid) {
    $homeFeedback.textContent = "Cargando materiales…";
    loadHomeRandom(8);
  }
});
