// carga la api segun el boton 
function cargarAPI(tipo) {
    if (tipo === 'api1') {
        cargarPokemon();
    } else if (tipo === 'api2') {
        cargarChiste();
    }
}

// api de pokemon 
function cargarPokemon() {
    const pokemonId = Math.floor(Math.random() * 150) + 1; // Pokémon aleatorio (1-150)
    
    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`)
        .then(response => response.json()) // recibe la response de la api y la convierte a json
        .then(data => {
            // manda al html los datos del pokemon con la imagen
            const html = `
                <h3>${data.name.toUpperCase()}</h3>
                <img src="${data.sprites.front_default}" alt="${data.name}">
                <p><strong>Tipo:</strong> ${data.types.map(t => t.type.name).join(', ')}</p>
                <p><strong>Altura:</strong> ${data.height / 10}m</p>
                <p><strong>Peso:</strong> ${data.weight / 10}kg</p>
            `;
            // envia el contenido al contenedor de la frase aleatoria
            document.getElementById("frase-aleatoria").innerHTML = html;
        })
        .catch(error => {
            document.getElementById("frase-aleatoria").innerHTML = 
                "<p class='sombra2'>Error al cargar Pokémon. Intenta nuevamente.</p>";
        });
}

// api de chistes buenisimos
function cargarChiste() {
    fetch("https://v2.jokeapi.dev/joke/Any?lang=es")
        .then(response => response.json())
        .then(data => {
            let contenido;
            if (data.joke) {
                contenido = `<p class="sombra3">${data.joke}</p>`;
            } else {
                contenido = `
                    <p class="sombra1">${data.setup}</p>
                    <p class="sombra2">${data.delivery}</p>
                `;
            }
            document.getElementById("frase-aleatoria").innerHTML = contenido;
        })
        .catch(error => {
            document.getElementById("frase-aleatoria").innerHTML = 
                "<p class='sombra1'>Error al cargar chiste. ¡Intenta de nuevo!</p>";
        });
}

// genera una de las 3 frases aleatoria 
function mostrarFraseAleatoria() {
    const frases = [
        {texto: "PIEDRA", clase: "sombra1"},
        {texto: "PAPEL", clase: "sombra2"},
        {texto: "TIJERA", clase: "sombra3"},
    ];

    const fraseElegida = frases[Math.floor(Math.random() * frases.length)];
    document.getElementById("frase-aleatoria").innerHTML =
        `<p class="${fraseElegida.clase}">${fraseElegida.texto}</p>`;
}

window.onload = mostrarFraseAleatoria;