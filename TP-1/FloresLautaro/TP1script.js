// API 1: Consejo 
function mostrarConsejo() {
    fetch('https://api.adviceslip.com/advice')
        .then(res => res.json())
        .then(data => {
            document.getElementById("contenido").innerHTML = `
                <h3>Consejo</h3>
                <p>"${data.slip.advice}"</p>
            `;
        });
}

// API 2: Pokémon 
function mostrarPokemon() {
    const id = Math.floor(Math.random() * 151) + 1; 
    fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
        .then(res => res.json())
        .then(data => {
            document.getElementById("contenido").innerHTML = `
                <h3>Pokémon</h3>
                <p><strong>Nombre:</strong> ${data.name.toUpperCase()}</p>
                <img src="${data.sprites.front_default}" alt="${data.name}">
            `;
        });
}

// Frases aleatorias 
        const frases = [
            'Si crees que puedes, ya estás a medio camino.',
            'La práctica hace al maestro.',
            'En medio de la dificultad se esconde la oportunidad.'
        ];

        const sombras = ['sombra1', 'sombra2', 'sombra3'];

        const indiceFrase = Math.floor(Math.random() * frases.length);
        const indiceSombra = Math.floor(Math.random() * sombras.length);

        const fraseRandom = frases[indiceFrase];
        const sombraAleatoria = sombras[indiceSombra];

        const fraseElemento = document.getElementById("frase");
        fraseElemento.textContent = fraseRandom;
        fraseElemento.classList.add(sombraAleatoria);