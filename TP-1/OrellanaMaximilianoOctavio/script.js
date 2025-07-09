document.addEventListener('DOMContentLoaded', () => {
    let frases = document.querySelectorAll('p.frase');
    let indice = Math.floor(Math.random() * frases.length);

    frases.forEach((frase, i) => {
        frase.style.display = i === indice ? 'block' : 'none';
    });
});

function crearTargerta() {
    const principal = document.getElementById('content');
    const contenedor = document.createElement("div");
    contenedor.className = "targeta";
    contenedor.style.display = "flex";
    contenedor.style.flexDirection = "column";
    contenedor.style.justifyContent = "center";
    contenedor.style.alignItems = "center";
    contenedor.style.gap = "1.5rem";
    contenedor.style.backgroundColor = "#2e0f12";
    contenedor.style.color = "#f5f5f5";
    contenedor.style.padding = "1.5rem";
    contenedor.style.borderRadius = "1rem";
    contenedor.style.boxShadow = "0 0 10px #00000080";
    contenedor.style.maxWidth = "800px";
    contenedor.style.margin = "2rem auto";
    principal.appendChild(contenedor);
}

async function Cancion() {
    const apiURL = 'https://itunes.apple.com/search?term=king+crimson&media=music&entity=song&limit=1&offset=ID';
    data = await GetAPI(apiURL);
    data = data.results.shift();
    console.log('Datos recibidos:', data);
    crearTargerta();
    const canciones = document.querySelectorAll('.targeta');
    const cancion = canciones[canciones.length - 1];
    const output = document.createElement('ul');
    output.innerHTML = `
        <li> <h2>${data.trackName} </h2></li>
        <li>${data.collectionName}</li>
        <li><img src="${data.artworkUrl100}" alt="${data.collectionName}"></li>
        <li><audio controls>
            <source src="${data.previewUrl}" type="audio/mp4">
            Tu navegador no soporta el elemento de audio.
        </audio></li>
        <li>Id: ${data.trackId}</li>
    `;
    cancion.appendChild(output);
    return data;
}

async function Pokemon() {
    const apiURL = 'https://pokeapi.co/api/v2/pokemon/ID';
    data = await GetAPI(apiURL);
    console.log('Datos recibidos:', data);
    crearTargerta();
    const pokemons = document.querySelectorAll('.targeta');
    const pokemon = pokemons[pokemons.length - 1];
    const output = document.createElement('ul');
    output.innerHTML = `
        <li><h2>${data.name}</h2></li>
        <li>Abilidades: ${data.abilities.map(abilitia => abilitia.ability.name).join(", ")}</li>
        <li><img src="${data.sprites.front_default}" alt="${data.name}"></li>
        <li><audio controls>
        <source src="${data.cries.legacy}" type="audio/mp4">
        Tu navegador no soporta el elemento de audio.
        </audio></li>
        <li>Id: ${data.id}</li>
    `;
    pokemon.appendChild(output);
    return data;
}

async function GetAPI(apiURL) {
    // numero aleatorio entre 1 y 255
    // si la api es de pokemon, agregar el numero aleatorio a la url
    if (apiURL.includes('pokeapi')) {
        const randomNumber = Math.floor(Math.random() * 255) + 1;
        apiURL = apiURL.replace("ID", randomNumber);
    }
    // si la api es de deezer rate, agregar el numero aleatorio a la url de 0 a 94
    if (apiURL.includes('itunes')) {
        const randomNumber = Math.floor(Math.random() * 94);
        apiURL = apiURL.replace("ID", randomNumber);
    }

    console.log('URL de la API:', apiURL);
    return fetch(apiURL)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la respuesta de la API');
            }
            return response.json();
        });
}
