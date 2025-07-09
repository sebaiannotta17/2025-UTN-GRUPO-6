document.addEventListener("DOMContentLoaded", () => {
  const enlaces = document.querySelectorAll("nav a");
  const output = document.getElementById("output");

  enlaces.forEach(enlace => {
    enlace.addEventListener("click", async (e) => {
      e.preventDefault();

      const apiURL = enlace.getAttribute("data-api");
      output.innerHTML = "Cargando...";

      try {
        const response = await fetch(apiURL);
        const data = await response.json();

        // Mostrar según el tipo de API
        if (apiURL.includes("exchangerate-api")) {
          const tasas = data.rates;
          output.innerHTML = `
            <h2>Cambio Monetario (Base: ${data.base})</h2>
            <ul>
              <li>EUR: ${tasas.EUR}</li>
              <li>ARS: ${tasas.ARS}</li>
              <li>BRL: ${tasas.BRL}</li>
              <li>GBP: ${tasas.GBP}</li>
              <li>JPY: ${tasas.JPY}</li>
            </ul>
          `;
        } else if (apiURL.includes("pokeapi")) {
          output.innerHTML = `
             <h2>Pokemon</h2>
            <ul>
              <li>Nombre: ${data.name}</li>
              <li>ID: ${data.id}</li>
              <li>Abilities: ${data.abilities.map(abilitia => abilitia.ability.name).join(", ")}</li>
              <li>imagen: <img src="${data.sprites.front_default}" alt="${data.name}"></li>
            </ul>
          `;
        } else {
          output.innerHTML = "<p>No se puede mostrar esta API.</p>";
        }

      } catch (error) {
        output.innerHTML = "Error al cargar los datos.";
        console.error("Error:", error);
      }
    });
  });
});
