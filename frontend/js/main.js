document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("search-form");
  const input = document.getElementById("search-input");

  if (!form || !input) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const query = input.value.trim();
    if (!query) return;

    // Redirige a busqueda.html con la palabra escrita
    window.location.href = `./busqueda.html?q=${encodeURIComponent(query)}`;
  });
});
