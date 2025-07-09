document.addEventListener('DOMContentLoaded', function() { // Esta funcion espera a que carge el DOM para agregar la frase random
	let randomFrase = document.getElementById('randText')
    //cont = document.getElementById('apis');
    const frases = ["No podemos resolver nuestros problemas con el mismo razonamiento que usamos cuando los creamos", "Cuando haces feliz a otras personas, recibes más felicidad a cambio. Deberías meditar bien sobre cuánta felicidad eres capaz de dar", "Es mejor fallar en la originalidad que triunfar en la imitación"];

    const randomShadow = ["0 0 3px #ff0000", "0 0 3px #FF0000, 0 0 5px rgb(242, 255, 0)", "2px 2px 4px rgb(94, 255, 0)"]

	//Seleccionar una frase aleatoria entre las 3 presentadas

	const fraseRandom = frases[Math.floor(Math.random() * frases.length)];

	//Mostrar la frase aleatoria en el documento

	randomFrase.textContent = fraseRandom;
    randomFrase.style.textShadow = randomShadow[Math.floor(Math.random() * randomShadow.length)] // Agrego una de las 3 sombras random al la frase aleatoria

    // Evento para la API numero 1
    const apis = document.getElementById('apis');
    const RandomAnime = document.getElementById('apiAnime');
    
    RandomAnime.addEventListener('click', (e) => {
        e.preventDefault();
        mostrarAnimeRandom();
    });
    
    function mostrarAnimeRandom() {
      // Traemos una lista de animes populares (top 25)
        fetch('https://api.jikan.moe/v4/top/anime')
        .then(response => response.json())
        .then(data => {
            const lista = data.data;
            const randomIndex = Math.floor(Math.random() * lista.length);
            const anime = lista[randomIndex];
    
        apis.innerHTML = `
            <h2>${anime.title}</h2>
            <img src="${anime.images.jpg.image_url}" alt="${anime.title}" style="width:200px;">
            <p><strong>Sinopsis:</strong> ${anime.synopsis}</p>
            <p><strong>Episodios:</strong> ${anime.episodes}</p>
            <p><strong>Score:</strong> ${anime.score}</p>
        `;
        })
        .catch(error => {
            console.error('Error al cargar anime random:', error);
            apis.innerHTML = `<p>Error al buscar un anime random.</p>`;
        });
    }

    //Evento para la API numero 2

    const btnPokemon = document.getElementById('apiPok');
    const apiContainer = document.getElementById('apis');
    
    btnPokemon.addEventListener('click', () => {
      const id = Math.floor(Math.random() * 1025) + 1; // Total de Pokémon
        fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
        .then(res => {
            if (!res.ok) throw new Error('No se pudo obtener el Pokémon');
            return res.json();
        })
        .then(data => {
            apiContainer.innerHTML = `
                <div class="card">
                <h3>${data.name.toUpperCase()}</h3>
                <p><strong>Tipo:</strong> ${data.types.map(t => t.type.name).join(', ')}</p>
                <img src="${data.sprites.front_default}" alt="${data.name}" style="width:150px;">
                </div>
            `;
        })
        .catch(err => {
            console.error('Error al obtener Pokémon:', err);
            apiContainer.innerHTML = `<p>Error al obtener Pokémon</p>`;
        });
    });
    
});