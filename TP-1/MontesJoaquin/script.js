    function frases() {
    const frases = [
      "<span id='frase1'>La creatividad es la inteligencia divirtiéndose.</span>",
      "<span id='frase2'>El único modo de hacer un gran trabajo es amar lo que haces.</span>",
      "<span id='frase3'>Aprender a programar es como adquirir una nueva forma de pensar.</span>"
    ];
    const aleatoria = frases[Math.floor(Math.random() * frases.length)];
    document.getElementById("frase").innerHTML = aleatoria;
  }

  async function cargarAPI1() {
    const main = document.getElementById("main-content");
    main.innerHTML = "<h2>Consultando vuelos en tiempo real...</h2>";
    try {
      const respuesta = await fetch("https://opensky-network.org/api/states/all?lamin=-35&lomin=-59&lamax=-34&lomax=-58");
      if (!respuesta.ok) throw new Error(`HTTP error! Status: ${respuesta.status}`);
      const datos = await respuesta.json();
      const vuelos = datos.states;

      if (!vuelos || vuelos.length === 0) {
        main.innerHTML = "<p>No se encontraron vuelos en este momento sobre Buenos Aires.</p>";
        return;
      }

      let html = `<h2>ICAO de vuelos sobre Argentina</h2>`;
      vuelos.slice(0, 5).forEach(vuelo => {
        html += `
          <div class="api-item">
            <strong>Aeronave:</strong> ${vuelo[1] || "N/A"}<br>
            <strong>Origen:</strong> ${vuelo[2] || "Desconocido"}<br>
            <strong>Altura:</strong> ${vuelo[7] ? vuelo[7].toFixed(0) + " m" : "N/A"}<br>
            <strong>Velocidad:</strong> ${vuelo[9] ? vuelo[9].toFixed(0) + " km/h" : "N/A"}
          </div>
        `;
      });
      main.innerHTML = html;
    } catch (error) {
      console.error("Error al consultar API 1:", error);
      main.innerHTML = `<p>Error al cargar datos de vuelos: ${error.message}</p>`;
    }
  }

  async function cargarAPI2() {
  const main = document.getElementById("main-content");
  main.innerHTML = "<h2>Buscando vulnerabilidades...</h2>";
  try {
    const respuesta = await fetch("https://services.nvd.nist.gov/rest/json/cves/2.0?keywordSearch=windows&resultsPerPage=5");
    if (!respuesta.ok) throw new Error(`HTTP error! Status: ${respuesta.status}`);
    const datos = await respuesta.json();
    const vulnerabilidades = datos.vulnerabilities;

    if (!vulnerabilidades || vulnerabilidades.length === 0) {
      main.innerHTML = "<p>No se encontraron vulnerabilidades recientes.</p>";
      return;
    }

    let html = "<h2>Últimas vulnerabilidades CVE (Windows)</h2>";
    vulnerabilidades.forEach(item => {
      const cve = item.cve;
      html += `
        <div class="api-item">
          <strong>${cve.id}</strong><br>
          <em>${cve.descriptions[0].value}</em>
        </div>
      `;
    });

    main.innerHTML = html;
  } catch (error) {
    console.error("Error en cargarAPI1:", error);
    main.innerHTML = `<p>Error al cargar vulnerabilidades: ${error.message}</p>`;
  }
}

function mostrarInicio() {
  const main = document.getElementById("main-content");
  main.innerHTML = `
    <p id="frase"></p>
    <p id="expectativa">
      Mis expectativas para la cátedra de Tecnología y Gestión Web son adquirir una comprensión sólida sobre el desarrollo de sitios web modernos utilizando HTML5, CSS3 y JavaScript. Espero aprender no solo a estructurar y diseñar páginas atractivas y funcionales, sino también a consumir APIs públicas e integrar diferentes tecnologías del entorno web. Además, deseo comprender las buenas prácticas de desarrollo y gestión de proyectos web que me permitan aplicar estos conocimientos en futuros desafíos académicos y profesionales.
    </p>
  `;
  frases();
}