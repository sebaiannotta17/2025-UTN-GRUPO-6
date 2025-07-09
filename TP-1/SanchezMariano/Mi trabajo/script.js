const frases = [
    { texto: "Cuando quieras rendirte, recordá por qué empezaste.", clase: "shadow1" },
    { texto: "Somos temporales jugando a ser infinitos.", clase: "shadow2" },
    { texto: "Errar a veces suele ser humano.", clase: "shadow3" }
];

window.onload = () => {
    // Frase aleatoria
    const elegida = frases[Math.floor(Math.random() * frases.length)];
    const divFrase = document.getElementById("frase");
    divFrase.textContent = elegida.texto;
    divFrase.classList.add(elegida.clase);
};

function cargarAPI(url) {
    const contenedor = document.getElementById("contenidoAPI");
    contenedor.innerHTML = "Cargando...";

    fetch(url)
        .then(res => res.json())
        .then(data => {
            // API de Scorebat (videos de fútbol)
            if (url.includes("scorebat")) {
                contenedor.innerHTML = "<h2>Videos recientes</h2>";
                data.response.slice(0, 5).forEach(match => {
                    const div = document.createElement("div");
                    div.innerHTML = `
                        <h3>${match.title}</h3>
                        <p>${match.competition}</p>
                        ${match.videos[0].embed}
                        <hr/>
                    `;
                    contenedor.appendChild(div);
                });

            // API de personajes de Disney
            } else if (url.includes("disneyapi.dev")) {
                contenedor.innerHTML = "<h2>Personajes de Disney</h2>";
                data.data.slice(0, 5).forEach(personaje => {
                    const div = document.createElement("div");
                    div.innerHTML = `
                        <h3>${personaje.name}</h3>
                        <img src="${personaje.imageUrl}" alt="${personaje.name}" width="200">
                        <p><strong>Películas:</strong> ${personaje.films.length > 0 ? personaje.films.join(", ") : "N/A"}</p>
                        <hr/>
                    `;
                    contenedor.appendChild(div);
                });

            // Otro caso genérico
            } else {
                contenedor.innerHTML = JSON.stringify(data, null, 2);
            }
        })
        .catch(err => {
            contenedor.innerHTML = "Error al cargar los datos.";
            console.error(err);
        });
}