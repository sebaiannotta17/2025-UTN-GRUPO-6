let frases = [
    "La vida es un viaje, no un destino.",
    "El conocimiento es poder.",
    "La felicidad no es algo hecho. Viene de tus propias acciones.",]

const changeContent = (view) => {
    const content = document.getElementById("mainSection");
    if (view === "home") {
        content.innerHTML = `<p id="frase"></p>
            <div class="divider">
                <span>Expectativas</span>
            </div>
            <div class="expectativasContainer">
                <p class="expectativas">Mis expectativas para esta materia son reforzar y consolidar los conocimientos que ya aplico en el ámbito laboral, especialmente en lo relacionado al desarrollo web con HTML, CSS, JavaScript y el consumo de APIs. Espero que la cursada me permita ordenar conceptualmente estos temas, profundizar en buenas prácticas y complementar mi experiencia práctica con una base teórica sólida.</p>
            </div>`;
            mostrarFrase();
    } else if (view === "pokemon") {
        content.innerHTML = `<h2>¿Que Pokemon es mas pesado?</h2>
                            <div id="pokemons"></div>
                            <p>Puntaje: <span id="pokemonScore">0</span></p>`;
        cargarPokemons();
    } else if (view === "countries") {
        content.innerHTML = `<h2>¿De que pais es la bandera?</h2>
                            <div id="country"></div>
                            <p>Puntaje: <span id="countryScore">0</span></p>`;
        cargarPais();
    }
}

const mostrarFrase = () => {
    const colors = ["#FF5733", "#33FF57", "#3357FF", "#723b9e"];
    const colorSelected = colors[Math.floor(Math.random() * colors.length)];
    const frase = frases[Math.floor(Math.random() * frases.length)];
    let fraseElement = document.getElementById("frase");
    fraseElement.innerText = frase;
    fraseElement.style.textShadow = `2px 2px 4px ${colorSelected}`;
    fraseElement.style.color = colorSelected;
}
changeContent("home");

///////////////////////////////////////////////////////////////// POKEAPI /////////////////////////////////////////////////////////////////

let puntajePokemon = 0;
const actualizarPuntaje = (cant) => {
    if (cant === 0) {
        puntajePokemon = 0;

    } else {
        puntajePokemon = puntajePokemon + 1;
    }
    document.getElementById("pokemonScore").innerText = puntajePokemon;
}
let pokemonSelected1 = {
    id: 0,
    weight: 0,
}
let pokemonSelected2 = {
    id: 0,
    weight: 0,
}
const cargarPokemons = async () => {
    random1 = Math.floor(Math.random() * 1000) + 1;
    random2 = Math.floor(Math.random() * 1000) + 1;
    const pokemon1 = await generarPokemon(random1);
    pokemonSelected1.id = random1;
    pokemonSelected1.weight = pokemon1.weight;
    const pokemon2 = await generarPokemon(random2);
    pokemonSelected2.id = random2;
    pokemonSelected2.weight = pokemon2.weight;
    document.getElementById("pokemons").innerHTML = "";
    document.getElementById("pokemons").appendChild(pokemon1.pokemon);
    document.getElementById("pokemons").appendChild(pokemon2.pokemon);
}

const generarPokemon = async (id) => {
    const response = await fetch("https://pokeapi.co/api/v2/pokemon/" + id);
    const data = await response.json();
    let pokemon = document.createElement("div");
    pokemon.classList.add("pokemon");
    pokemon.innerHTML = `<img src="${data.sprites.front_default}" alt="Pokemon ${id}">
    <h2>${data.name}</h2>
    <p onclick="verificarPesos(${data.id})" class="btnPesado">+ Pesado</p>`;
    let pokemonData = {
        pokemon: pokemon,
        weight: data.weight,
    }
    return pokemonData;
}

const verificarPesos = (id) => {
    if (pokemonSelected1.id === id) {
        if (pokemonSelected1.weight > pokemonSelected2.weight) {
            actualizarPuntaje(1);
            cargarPokemons();
        } else if (pokemonSelected1.weight < pokemonSelected2.weight) {
            alert("Estas equivocado! Puntaje maximo: " + puntajePokemon);
            actualizarPuntaje(0);
            cargarPokemons();
        } else {
            alert("Los Pokemons tienen el mismo peso.");
        }
    }
    if (pokemonSelected2.id === id) {
        if (pokemonSelected2.weight > pokemonSelected1.weight) {
            actualizarPuntaje(1);
            cargarPokemons();
        } else if (pokemonSelected2.weight < pokemonSelected1.weight) {
            alert("Estas equivocado! Puntaje maximo: " + puntajePokemon);
            actualizarPuntaje(0);
            cargarPokemons();
        } else {
            alert("Los Pokemons tienen el mismo peso.");
        }
    }
}

///////////////////////////////////////////////////////////////// RESTCOUNTRIES /////////////////////////////////////////////////////////////////

let countrySelected = {}

const cargarPais = async () => {
    await generarPais();
    document.getElementById("country").innerHTML = `<img src="${countrySelected.flag}" alt="Bandera de ${countrySelected.name} " class="flag">
    <form id="formPais">
        <input type="text" id="inputPais" placeholder="Escribe el nombre del pais">
        <button type="submit" class="btnPais">Verificar</button>
    </form>`;
    document.getElementById("inputPais").focus();
    document.getElementById("formPais").addEventListener("submit", verificarPais);
}

const generarPais = async () => {
    const response = await fetch("https://restcountries.com/v3.1/lang/spanish");
    const data = await response.json();
    let randomIndex = Math.floor(Math.random() * data.length);
    let country = data[randomIndex];
    countrySelected = {
        Fullname: country.translations.spa.official,
        name: country.translations.spa.common,
        flag: country.flags.svg
    };
}

const normalizarTexto = (texto) => {
    return texto.toLowerCase().replace(/á|é|í|ó|ú/g, (match) => {
        switch (match) {
            case 'á': return 'a';
            case 'é': return 'e';
            case 'í': return 'i';
            case 'ó': return 'o';
            case 'ú': return 'u';
        }
    });
}

const verificarPais = (e) => {
    e.preventDefault();
    let inputPais = normalizarTexto(document.getElementById("inputPais").value);
    let countryName = normalizarTexto(countrySelected.name);
    let countryFullname = normalizarTexto(countrySelected.Fullname);
    if (inputPais === countryName || inputPais === countryFullname) {
        document.getElementById("countryScore").innerText = parseInt(document.getElementById("countryScore").innerText) + 1;
        cargarPais();
    } else {
        alert("Estas equivocado! Puntaje maximo: " + document.getElementById("countryScore").innerText + ". El pais era: " + countryFullname + " o " + countryName); 
        document.getElementById("countryScore").innerText = 0;
        cargarPais();
    }
}
