// Por ahora NO mostramos resultados ni llamamos a la API.
// Solo capturamos el texto y dejamos preparado el lugar del listado.

const $form = document.getElementById("searchForm");
const $q = document.getElementById("q");
const $btn = document.getElementById("btnSearch");
const $feedback = document.getElementById("feedback");
const $results = document.getElementById("results");

// Estado inicial
$feedback.textContent = "Escribí algo y tocá Buscar. (Resultados ocultos por ahora)";
$results.innerHTML = ""; // reservado para el futuro

$form.addEventListener("submit", (e) => {
  e.preventDefault();

  const text = $q.value.trim();

  // Validación mínima
  if (!text) {
    $feedback.textContent = "Ingresá un texto para buscar.";
    return;
  }

  // “Simulamos” que busca (sin mostrar nada todavía)
  $btn.disabled = true;
  $feedback.textContent = `Buscando “${text}”… (aún no mostramos resultados)`;

  // Acá después irá: fetch(...) o filtro de mock/DB
  setTimeout(() => {
    // Por ahora no renderizamos nada en #results
    $feedback.textContent = `Búsqueda lista para “${text}”. (Resultados ocultos)`;
    $btn.disabled = false;
  }, 400);
});
