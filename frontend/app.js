// --- Config ---
const USE_MOCK = false; // <— ahora usamos la API
const API_URL = "http://localhost:3000/api/materials";

// --- DOM ---
const $form = document.getElementById("searchForm");
const $q = document.getElementById("q");
const $feedback = document.getElementById("feedback");
const $results = document.getElementById("results");

// --- Render ---
function render(items, text = "") {
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

  $results.innerHTML = items.map(m => `
    <li class="card">
      <h3>${m.name}</h3>
      <p>${m.desc ?? ""}</p>
      <div class="price">$${(m.price ?? "-").toLocaleString("es-AR")}</div>
    </li>
  `).join("");
}

// --- Buscar ---
async function search(text) {
  const q = (text || "").trim();
  try {
    const res = await fetch(`${API_URL}?text=${encodeURIComponent(q)}`);
    const data = await res.json();
    return Array.isArray(data) ? data : (data.items ?? []);
  } catch (e) {
    console.error(e);
    $feedback.textContent = "Error consultando la API";
    return [];
  }
}

// --- Evento ---
$form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const text = $q.value.trim();
  $feedback.textContent = text ? `Buscando “${text}”…` : "Buscando…";
  $results.innerHTML = "";
  const items = await search(text);
  render(items, text);
});

// --- Estado inicial: traer todo desde la API ---
(async () => {
  $feedback.textContent = "Cargando materiales…";
  const items = await search("");
  render(items, "");
})();
