//const apiRickMorty = "https://rickandmortyapi.com/api/character";

/* Esta funcion me va a generar y devolver un numero aleatorio que la voy a utilizar en varios lugares*/
function numeroRandom(array) {
    return Math.floor(Math.random() * array.length);
}

/* --- PRIMERA API --- */
//esta función va a crear una tarjeta visual con los datos de cada personaje
function makeCard(character) {
    //hacemos destructuring del objeto para obtener directamente las propiedades que nos interesan
    const { name, species, image } = character;

    const title = document.createElement("h3");
    title.textContent = name;
    title.setAttribute('style', '-webkit-text-stroke: 0.5px black; margin: 10px'); /* Esto es para el contorno del texto */
    if (species !== "Human") {
        title.style.color = 'red';
    }

    const characterSpecies = document.createElement("p");
    characterSpecies.style.padding = '5px';
    characterSpecies.textContent = ("ESPECIE: " + species);
    //cambiamos el color del texto según el estado del personaje
    if (species !== "Human") characterSpecies.style.color = "red";
    else characterSpecies.style.color = "#1F2937";
    //podríamos agregar más condiciones si quisiéramos más colores

    const characterImage = document.createElement("img");
    characterImage.src = image;
    characterImage.setAttribute('style', `
        height: 250px;
    `);

    //creamos el contenedor de la tarjeta
    const Card = document.createElement("div");
    Card.setAttribute('style', `
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        border-radius: 10px;
        overflow: hidden;
        background-color: #f4f6fc;
    `);
    Card.appendChild(title);
    Card.appendChild(characterImage);
    Card.appendChild(characterSpecies);

    return Card
};

//esta función se encarga de obtener los personajes desde la API
async function mostrarPersonajes(apiRickMorty, cardsContainer) {

    cardsContainer.setAttribute('style', `
        margin-top: 10px;
        border-radius: 10px;
        display: flex;
        gap: 10px;
        justify-content: center;
        align-items: center;
        padding: 10px;
    `);


    try {
        const response = await fetch(apiRickMorty);
        //fetch va a devolver una promesa
        //la promesa puede ser nula, o un valor. Pero no se sabe en qué momento va a volver esa respuesta
        //para eso se utiliza el async, con el que puedo utilizar el await, que espera a que esa respuesta llegue y la guarda en una variable
        //la respuesta que recibe await es un JSON

        const { results } = await response.json();
        //este método va a parsearlo a algo que entienda el javascript. Pero como devuelve una promesa, de vuelta tenemos que usar el await
        //las llaves acceden directamente a la propiedad del objeto respuesta que se llama results y nos ahorramos varios pasos

        /* Voy a imprimir a Rick y a uno random */
        cardsContainer.appendChild(makeCard(results[0]));

        // Me aseguro que no imprima a Rick dos veces
        do
            var i = numeroRandom(results);
        while (i == 0);
        const Card = makeCard(results[i]);

        //insertamos la tarjeta en el contenedor principal
        cardsContainer.appendChild(Card);

        //en caso de que querramos ver si esto funciona hacemos:
        //throw new Error("API ERROR"); esto va directamente al catch
        console.log(results);
    } catch (error) {
        console.error(error);
    }
    //una buena práctica es usar el try-catch para el manejo de errores
}

document.addEventListener("DOMContentLoaded", function () {
    const linkRickMorty = document.getElementById("a_rickMorty");
    const url = "https://rickandmortyapi.com/api/character";
    //event captura el evento. Queseria el click
    linkRickMorty.onclick = function (event) {
        //obtenemos el contenedor donde se van a insertar las tarjetas
        const cardsContainer = document.getElementsByClassName("cards-container")[0];

        //Esto que le pongo acá es para ver si ya le dio click a alguno de los dos links

        const formulario = document.getElementById("seleccionar_pokemon");

        if (linkRickMorty.style.color === "red") {
            //Primero tengo que eliminar todos los hijos
            while (cardsContainer.firstChild) {
                cardsContainer.removeChild(cardsContainer.firstChild);
            }
        } else if (formulario.style.display === "flex") {
            //Le dio link a la apli de pokemon
            formulario.style.display = "none";
            while (cardsContainer.firstChild) {
                cardsContainer.removeChild(cardsContainer.firstChild);
            }
            //Seteo la flag que me dice si ya hizo click
            linkRickMorty.style.color = "red";
            linkRickMorty.innerHTML = "Nueva Carta";
        } else {
            //Seteo la flag que me dice si ya hizo click
            linkRickMorty.style.color = "red";
            linkRickMorty.innerHTML = "Nueva Carta";
        }

        event.preventDefault(); // evita que se recargue/redirija la página y la recarga
        mostrarPersonajes(url, cardsContainer);
    };
});



/* --- SEGUNDA API --- */
// Función que consume la API
async function hola(url) {
    try {
        // Hacemos el fetch y esperamos la respuesta
        var response = await fetch(url);
        // Parseamos la respuesta a JSON cuando llegue el fetch. Si no ponemos await acá, va a intentar parsear algo que no llegó
        var data = await response.json();
        // Extraemos la lista de resultados que son los pokémons
        var { results } = data;

        console.log(results);

        return results

        // Recorremos y creamos una tarjeta para cada pokémon
        //for (let i = 0; i < results.length; i++) {
        //     makeCard(results[i]);
        // }

    } catch (error) {
        console.error("Error al cargar los pokémon: " + error);
    }
}

document.addEventListener("DOMContentLoaded", function () {

    const url = "https://pokeapi.co/api/v2/pokemon?limit=10";
    const linkPokemon = document.getElementById("a_pokemon");

    // JavaScript solo permite usar await dentro de una función marcada como async

    // declaro la variable afuera para que sea global al handler
    let pokemones = [];

    linkPokemon.onclick = async function (event) {
        event.preventDefault(); // evita que se recargue/redirija la página y la recarga
        const formulario = document.getElementById("seleccionar_pokemon");
        console.log(formulario);

        //Me fijo si ya habia clickeado en la otra API
        const linkRick = document.getElementById("a_rickMorty");
        if (linkRick.style.color === "red") {
            linkRick.style.color = "#00FFFF";
            linkRick.innerHTML = "Rick y Morty";
            const cardsContainer = document.getElementsByClassName("cards-container")[0];
            //Primero tengo que eliminar todos los hijos
            while (cardsContainer.firstChild) {
                cardsContainer.removeChild(cardsContainer.firstChild);
            }
        };


        // Seleccionamos el <select> por su ID
        const select = document.getElementsByName("pokemon")[0];

        // Esperamos a que la función async devuelva los datos
        pokemones = await hola(url);
        console.log(pokemones);

        // Ahora sí pokemones es un array válido
        for (let i = 0; i < pokemones.length; i++) {
            const { name } = pokemones[i];
            const opt = document.createElement("option");
            opt.innerHTML = name;
            opt.value = name;
            select.appendChild(opt);
        }

        formulario.setAttribute('style', 'display: flex')

        const boton = formulario.getElementsByTagName("button")[0];
        console.log(boton.innerHTML);

        boton.onclick = async function (event) {
            event.preventDefault(); //evita el envío del formulario

            //1. Ya tenemos el select que lo recuperamos más arriba
            // "const select"

            // 2. Accedemos al valor del <option> que está seleccionado
            const pokemonSeleccionado = select.value;

            // Buscamos el objeto cuyo nombre coincide (esto lo saqué de chat)
            const pokemonObjeto = pokemones.find(p => p.name === pokemonSeleccionado);

            // Mostramos la URL si existe
            if (pokemonObjeto) {
                console.log("URL del Pokémon:", pokemonObjeto.url);

                async function recuperar() {
                    try {
                        const response = await fetch(pokemonObjeto.url);
                        const result = await response.json();
                        console.log(result);
                        return result;
                    } catch (error) {
                        console.error(error);
                    }
                }

                const contenedor = document.getElementsByClassName("cards-container")[0];

                // Limpiar cartas anteriores si hay
                while (contenedor.firstChild) {
                    contenedor.removeChild(contenedor.firstChild);
                }

                // Esperar a que recuperar() devuelva el objeto Pokémon
                const pokemonCompleto = await recuperar();
                const card = makePokemon(pokemonCompleto);
                contenedor.appendChild(card);

            } else {
                console.error("No se encontró el Pokémon seleccionado.");
            }

            // 3. Lo mostramos por consola
            console.log("Pokémon elegido:", pokemonObjeto);
        };
    };
});

function makePokemon(pokemon) {
    const { name, sprites, types } = pokemon;

    const title = document.createElement("h3");
    title.textContent = name;
    title.setAttribute('style', 'color: #00FFFF; -webkit-text-stroke: 0.5px black; margin: 10px'); /* Esto es para el contorno del texto */

    const characterType = document.createElement("p");
    characterType.textContent = "TIPO: " + types.map(t => t.type.name).join(", ");
    characterType.style.color = "#3B4CCA";

    const characterImage = document.createElement("img");
    characterImage.src = sprites.other["official-artwork"].front_default || sprites.front_default;
    characterImage.setAttribute('style', `
    width: 250px;
    height: auto;
    display: block;
    margin: 0 auto;
`);

    const card = document.createElement("div");
    card.setAttribute('style', `
        border-radius: 10px;
        display: flex;
        flex-direction: column;
        justify-content:center;
        align-items: center;
        padding: 10px;
        background-color: #f4f6fc;
        width: fit-content;
        margin: 15px; 
        padding: 10px;
    `);

    card.appendChild(title);
    card.appendChild(characterImage);
    card.appendChild(characterType);

    return card;
}

/* --- EJERCICIO N5 --- */
document.addEventListener("DOMContentLoaded", function () {
    const frases = [
        '<span id="sombra1">"Seamos libres lo demás no importa": San Martin</span>',
        '<span id="sombra2">"La pelota no se mancha": Diego Maradona</span>',
        '<span id="sombra3">"Ladran sancho señal que cabalgamos": Don Quijote</span>'
    ];
    const aleatoria = numeroRandom(frases);
    document.getElementById("frase").innerHTML = frases[aleatoria];
});