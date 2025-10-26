document.addEventListener("DOMContentLoaded", async () => {
  const form = document.getElementById("searchForm");
  const input = document.getElementById("q");
  const resultsContainer = document.getElementById("results");
  const API_URL = "http://localhost:3000/api/busqueda";

  // Leer parámetro "q" de la URL
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

  // Función de búsqueda
  async function buscar(query) {
    resultsContainer.innerHTML = "";

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

      data.results.forEach((pub) => {
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
    } catch (err) {
      console.error(err);
      resultsContainer.innerHTML = `<p class="error">Error al conectar con el servidor.</p>`;
    }
  }
});
