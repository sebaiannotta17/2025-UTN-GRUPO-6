document.addEventListener("DOMContentLoaded", function () {
    mostrarFraseAleatoria();
});

function mostrarFraseAleatoria() {
    const frases = [
        "Cuando la VOLUNTAD es GRANDE los obstáculos son PEQUEÑOS.",
        "La FE es un combustible IRREMPLAZABLE.",
        "Lo ESENCIAL es INVISIBLE a los ojos."
    ];

    const indice = Math.floor(Math.random() * frases.length);
    const contenedorFrase = document.getElementById("frase");

    contenedorFrase.textContent = frases[indice];

    // Quita clases anteriores
    contenedorFrase.classList.remove("frase1", "frase2", "frase3");

    // Aplica la clase correspondiente
    contenedorFrase.classList.add(`frase${indice + 1}`);
}


// Oculta la opinión al tocar una API
function ocultarOpinion() {
    document.getElementById("opinion").classList.remove("opinion-visible");
    document.getElementById("opinion").classList.add("opinion-oculta");
}

// API de perros
document.getElementById("apiperros").addEventListener("click", function (e) {
    e.preventDefault();
    mostrarPerro();
    ocultarOpinion();
});

function mostrarPerro() {
    fetch("https://dog.ceo/api/breeds/image/random")
        .then(res => res.json())
        .then(data => {
            const urlImagen = data.message;
            const partes = urlImagen.split("/");
            const raza = partes[4].replace("-", " "); // Extrae la raza del URL

            const contenedor = document.getElementById("contenido");
            contenedor.innerHTML = `
                <h2>Perro Aleatorio</h2>
                <img src="${urlImagen}" alt="Perro" style="max-width:100%; height:auto;"><br><br>
                <p><strong>Raza estimada:</strong> ${raza.charAt(0).toUpperCase() + raza.slice(1)}</p>
                <p><strong>Fuente:</strong> dog.ceo</p>
            `;
        })
        .catch(err => {
            console.error(err);
            document.getElementById("contenido").innerHTML = `<p>Error al obtener imagen de perro.</p>`;
        });
}


// API de Pokémon
document.getElementById("apipokemon").addEventListener("click", function (e) {
    e.preventDefault();
    mostrarPokemon();
    ocultarOpinion();
});

function mostrarPokemon() {
    const randomId = Math.floor(Math.random() * 151) + 1;
    fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`)
        .then(res => res.json())
        .then(data => {
            const contenedor = document.getElementById("contenido");
            contenedor.innerHTML = `
                <h2>${data.name.charAt(0).toUpperCase() + data.name.slice(1)}</h2>
                <img src="${data.sprites.front_default}" alt="${data.name}"><br><br>
                <p><strong>Altura:</strong> ${data.height}</p>
                <p><strong>Peso:</strong> ${data.weight}</p>
                <p><strong>Tipo:</strong> ${data.types.map(t => t.type.name).join(", ")}</p>
            `;
        })
        .catch(err => {
            console.error(err);
            document.getElementById("contenido").innerHTML = `<p>Error al obtener datos de Pokémon.</p>`;
        });
}
