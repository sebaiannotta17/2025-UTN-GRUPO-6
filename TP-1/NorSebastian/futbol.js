function mostrarEquipos() {
  const url = "https://www.thesportsdb.com/api/v1/json/3/search_all_teams.php?l=Spanish%20La%20Liga";

  fetch(url)
    .then(response => response.json())
    .then(data => {
      const contenido = document.getElementById("contenido");
      contenido.innerHTML = "<h2>Equipos de La Liga Española:</h2><ul>";

      data.teams.forEach(team => {
        contenido.innerHTML += `
          <li>
            <strong>${team.strTeam}</strong> - Fundado en ${team.intFormedYear}
          </li>
        `;
      });

      contenido.innerHTML += "</ul>";
    })
    .catch(error => {
      console.error("Error al obtener equipos:", error);
    });
}

function mostrarEquiposPremier() {
  const url = "https://www.thesportsdb.com/api/v1/json/3/search_all_teams.php?l=English%20Premier%20League";

  fetch(url)
    .then(response => response.json())
    .then(data => {
      const contenido = document.getElementById("contenido");
      contenido.innerHTML = "<h2>Equipos de la Premier League:</h2><ul>";

      data.teams.forEach(team => {
        contenido.innerHTML += `
          <li>
            <strong>${team.strTeam}</strong> - Fundado en ${team.intFormedYear}
          </li>
        `;
      });

      contenido.innerHTML += "</ul>";
    })
    .catch(error => {
      console.error("Error al obtener equipos de la Premier League:", error);
    });
}
