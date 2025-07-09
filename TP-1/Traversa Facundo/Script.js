window.onload = function() {
  mostrarFraseAleatoria();
};
function mostrarFraseAleatoria() {
  const frases = [
    "Colapinto esta en la F1",
    "Red Bull > mclaren",
    "Max 'el papi' Verstappen"
  ];

  const randomIndex = Math.floor(Math.random() * frases.length);
  const fraseSeleccionada = frases[randomIndex];

  const fraseElement = document.getElementById("fraseF1");
  fraseElement.textContent = fraseSeleccionada;
}

function loadAPI(apiName, event) {
  if (event) event.preventDefault();

  const content = document.getElementById("contenido");

  if (apiName === "f1") {
    content.innerHTML = `<p>Cargando piloto de Fórmula 1...</p>`;

    fetch("https://ergast.com/api/f1/current/drivers.json")
      .then(response => response.json())
      .then(data => {
        const drivers = data.MRData.DriverTable.Drivers;
        const randomIndex = Math.floor(Math.random() * drivers.length);
        const driver = drivers[randomIndex];
        const wikiName = `${driver.givenName}_${driver.familyName}`;
        const wikiURL = `https://en.wikipedia.org/api/rest_v1/page/summary/${wikiName}`;

        fetch(wikiURL)
          .then(res => res.json())
          .then(wikiData => {
            const image = wikiData.thumbnail?.source;

            if (image) {
              content.innerHTML = `
                <p><strong>${driver.givenName} ${driver.familyName}</strong></p>
                <p>Nacionalidad: ${driver.nationality}</p>
                <img src="${image}" alt="Piloto F1" style="max-width:200px; border-radius: 8px;">
              `;
            } else {
              mostrarAutoYEscuderia(content);
            }
          })
          .catch(() => {
            mostrarAutoYEscuderia(content);
          });
      })
      .catch(error => {
        content.innerHTML = `<p>Error al cargar datos de F1: ${error.message}</p>`;
      });
  } else if (apiName === "f1-constructores") {
  content.innerHTML = `<p>Cargando escudería...</p>`;

  fetch("https://ergast.com/api/f1/current/constructors.json")
    .then(response => response.json())
    .then(data => {
      const teams = data.MRData.ConstructorTable.Constructors;
      const randomTeam = teams[Math.floor(Math.random() * teams.length)];

      content.innerHTML = `
        <p><strong>Escuderia:${randomTeam.name}</strong> </p>
        <p><strong>Nacionalidad: ${randomTeam.nationality}</strong></p>
      `;
    })
    .catch(error => {
      content.innerHTML = `<p>Error al cargar: ${error.message}</p>`;
    });
  }
}
