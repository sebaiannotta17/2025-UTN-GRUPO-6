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

const $form = document.getElementById("searchForm");
const $q = document.getElementById("q");
const $feedback = document.getElementById("feedback");
const $results = document.getElementById("results");

let LAST_ITEMS = [];

function escapeHtml(s = "") {
  return s.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
}
function formatAr(n) {
  const x = Number(n);
  return Number.isFinite(x) ? x.toLocaleString("es-AR") : "-";
}
function initials(name = "") {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase() ?? "").join("");
}

// Cards de resultados
function render(items, text = "") {
  LAST_ITEMS = items;

  if (!items.length) {
    $feedback.textContent = text
      ? `No se encontraron materiales para “${text}”`
      : "No hay materiales para mostrar";
    $results.innerHTML = "";
    return;
  }

  $feedback.textContent = text
    ? `Resultados para “${text}” (${items.length})`
    : `Mostrando todos (${items.length})`;

  $results.innerHTML = items
    .map((m, i) => {
      const ini = initials(m.name ?? "");
      const url = (m.image_url ?? m.imageUrl ?? "").toString().trim();
      const hasImg = !!url;
      const desc = (m.desc ?? m.descripcion ?? "").toString();

      const thumb = hasImg
        ? `<img class="thumb-img" src="${escapeHtml(url)}"
               alt="${escapeHtml(m.name ?? "")}" loading="lazy" decoding="async">`
        : `<div class="thumb" data-initial="${ini}"></div>`;

      return `
      <li class="card" data-idx="${i}">
        ${thumb}
        <h3>${escapeHtml(m.name ?? "—")}</h3>
        <p class="muted">${escapeHtml(desc)}</p>
        <div class="price">$${formatAr(m.price)}</div>
      </li>
    `;
    })
    .join("");
}

// Buscar Materiales
async function search(text) {
  const q = (text || "").trim();

  if (!USE_MOCK) {
    try {
      const res = await fetch(`${API_URL}?text=${encodeURIComponent(q)}`);
      const data = await res.json();
      const arr = Array.isArray(data) ? data : (data.items ?? []);
      if (arr.length) return enrichWithImages(arr);
    } catch (e) {
      console.error("API error:", e);
    }
  }

  if (!q) return MOCK_LOCAL;
  const qlow = q.toLowerCase();
  return MOCK_LOCAL.filter((m) =>
    `${m.name} ${m.desc ?? m.descripcion ?? ""}`.toLowerCase().includes(qlow),
  );
}

$form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const text = $q.value.trim();

  const newUrl = text ? `?q=${encodeURIComponent(text)}` : location.pathname;
  history.replaceState(null, "", newUrl);

  $feedback.textContent = text ? `Buscando “${text}”…` : "Buscando…";
  $results.innerHTML = "";
  const items = await search(text);
  render(items, text);
});

const params = new URLSearchParams(location.search);
const Q_FROM_URL = (params.get("q") || "").trim();
if ($q) $q.value = Q_FROM_URL;

(async () => {
  const initialText = Q_FROM_URL;
  $feedback.textContent = initialText
    ? `Buscando “${initialText}”…`
    : "Cargando materiales…";
  const items = await search(initialText);
  render(items, initialText);
})();

$results.addEventListener("click", (e) => {
  const li = e.target.closest("li.card");
  if (!li) return;
  const idx = Number(li.dataset.idx);
  const m = LAST_ITEMS[idx];
  if (!m) return;
  openModal(m);
});

function setText(id, value) {
  const el = document.getElementById(id);
  if (!el) return;
  el.replaceChildren(document.createTextNode(String(value ?? "")));
}
function setTextOrHide(id, value) {
  const el = document.getElementById(id);
  if (!el) return;
  const v = (value ?? "").toString().trim();
  if (v) {
    el.style.display = "";
    el.replaceChildren(document.createTextNode(v));
  } else {
    el.style.display = "none";
  }
}

function openModal(m) {
  const modal = document.getElementById("materialModal");
  if (!modal) return;

  const name = m.name ?? "—";
  setText("mName", name);
  setTextOrHide("mDesc", m.desc ?? "");
  setTextOrHide("mLongDesc", m.descripcion ?? "");
  setText("mPrice", ` $${formatAr(m.price)}`);
  setText("mCategory", m.category ?? m.categoria ?? "—");
  setText("mQty", m.qty ?? m.cantidad ?? "—");

  const thumb = document.getElementById("mThumb");
  if (thumb) {
    const url = (m.image_url ?? m.imageUrl ?? "").toString().trim();
    if (url) {
      thumb.innerHTML = "";
      const img = document.createElement("img");
      img.className = "modal-thumb-img";
      img.alt = name;
      img.loading = "lazy";
      img.src = url;
      img.onerror = () => {
        thumb.textContent = initials(name);
      };
      thumb.appendChild(img);
    } else {
      thumb.textContent = initials(name);
    }
  }

  const details = m.details ?? m.detalles ?? {};
  const $ul = document.getElementById("mDetails");
  if ($ul) {
    $ul.innerHTML = Object.keys(details)
      .map(
        (k) =>
          `<li><strong>${escapeHtml(k)}:</strong> ${escapeHtml(String(details[k]))}</li>`,
      )
      .join("");
  }

  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");
}

function closeModal() {
  const modal = document.getElementById("materialModal");
  if (!modal) return;
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
}

document.getElementById("materialModal")?.addEventListener("click", (e) => {
  if (e.target.dataset.close === "1") closeModal();
});
document
  .querySelector("#materialModal .modal-close")
  ?.addEventListener("click", closeModal);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});

$results.addEventListener(
  "error",
  (e) => {
    if (!e.target.matches(".thumb-img")) return;
    const li = e.target.closest("li.card");
    const idx = Number(li?.dataset.idx);
    const m = LAST_ITEMS[idx];
    const ph = document.createElement("div");
    ph.className = "thumb";
    ph.setAttribute("data-initial", initials(m?.name ?? ""));
    e.target.replaceWith(ph);
  },
  true,
);

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

(() => {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const $actions = document.querySelector(".header-actions");
  if (!$actions) return;

  const $loginBtn = document.getElementById("btn-login");
  const $publicarBtn = document.getElementById("btn-publicar");

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
})();

(() => {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const $actions = document.querySelector(".header-actions");
  if (!$actions) return;

  const $loginBtn = document.getElementById("btn-login");
  const $publicarBtn = document.getElementById("btn-publicar");

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
})();
