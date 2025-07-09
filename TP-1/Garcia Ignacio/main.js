document.addEventListener("DOMContentLoaded", () => {
    const origin = document.querySelector("#origin");
    const random = document.querySelector("#random");
    const linkPokemon = document.querySelector("#linkPokemon");
    const linkCocktail = document.querySelector("#linkCocktail");
    const pokemon = document.querySelector("#pokemon");
    const cocktail = document.querySelector("#cocktail");

    const phrases = [
        "For the glory of mandkind",
        "You have no enemies",
        "El psy kongroo"
    ];

    const textShadow = [
        "0px 2px 2px rgba(255, 0, 255, 0.3)",
        "0px 2px 2px rgba(100, 0, 150, 0.6)",
        "0px 2px 2px rgba(0, 255, 200, 0.4)"
    ];

    const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)]
    const randomShadow = textShadow[Math.floor(Math.random() * textShadow.length)]

    random.textContent = randomPhrase;
    random.style.textShadow = randomShadow;

    pokemon.style.display = "none";
    cocktail.style.display = "none";

    linkPokemon.addEventListener("click", (event) => {
        event.preventDefault();
        origin.innerHTML = ``;
        cocktail.style.display = "none";
        pokemon.style.display = "block";
    });

    linkCocktail.addEventListener("click", (event) => {
        event.preventDefault();
        origin.innerHTML = ``;
        pokemon.style.display = "none";
        cocktail.style.display = "block";
    });
});

//API 1

const containerPokemon = document.querySelector("#container-pokemon")
const spinnerPokemon = document.querySelector("#spinner-pokemon")

let offsetP = 1;
let limitP = 99;

const morePokemons = () => {
    offsetP += 100;
    fetchPokemons(offsetP, limitP);
}

async function fetchPokemon(id) {
    try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`);
        const dataP = await res.json();
        createPokemon(dataP);
    } catch (error) {
        console.error(`Error al obtener el Pokémon con ID ${id}:`, error);
    } finally {
        spinnerPokemon.style.display = "none";
    }
}

async function fetchPokemons(offsetP, limitP) {
    spinnerPokemon.style.display = "block";
    for (let i = offsetP; i <= offsetP + limitP; i++) {
        if (i > 1025) {
            alert("Ha llegado al tope de Pokémons");
            break;
        } else if (i <= 1025) {
            await fetchPokemon(i);
        }
    }
}

function createPokemon(pokemon){
    /*let pokemon = dataP*/
    let elemento = document.createElement("div")
    elemento.innerHTML = `
        <div class="col">
            <div class="card">
                <h6 class="text-end text-bg-warning ms-auto mt-2 me-2 p-1 rounded">
                    ${pokemon.id}
                </h6>
                <img src="${pokemon.sprites.front_default}" onerror="this.onerror=null; this.src='./IMG/default-pokemon.png'" alt="" class="img-fluid">
                <div class="card-body">
                    <h4 class="card-title text-center text-capitalize">
                        ${pokemon.name}
                    </h4>
                </div>
                <button type="button" class="btn btn-dark text-warning fw-bold mx-auto my-2" data-bs-toggle="modal" data-bs-target="#flush-${pokemon.id}">Ver mas</button>
            </div>
            <div class="modal fade" id="flush-${pokemon.id}" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title text-capitalize">
                                ${pokemon.name}
                            </h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <ul class="list-group list-group-flush">
                                <li class="list-group-item">
                                    <div class="text-capitalize">
                                        <b>Tipo:</b>${pokemon.types[0].type.name}
                                    </div>
                                </li>
                                <li class="list-group-item">
                                    <b>Experiencia base:</b>${pokemon.base_experience}
                                </li>
                                <li class="list-group-item">
                                    <b>Altura:</b>${pokemon.height} cm
                                </li>
                                <li class="list-group-item">
                                    <b>Peso:</b>${pokemon.weight} kg
                                </li>
                                <li class="list-group-item">
                                    <b>Estadisticas:</b>
                                    <div class="text-start text-capitalize">
                                        <i class="bi bi-caret-right-fill"></i>
                                        ${pokemon.stats[0].stat.name}:${pokemon.stats[0].base_stat}
                                        <br>
                                        <i class="bi bi-caret-right-fill"></i>
                                        ${pokemon.stats[1].stat.name}:${pokemon.stats[1].base_stat}
                                        <br>
                                        <i class="bi bi-caret-right-fill"></i>
                                        ${pokemon.stats[2].stat.name}:${pokemon.stats[2].base_stat}
                                        <br>
                                        <i class="bi bi-caret-right-fill"></i>
                                        ${pokemon.stats[3].stat.name}:${pokemon.stats[3].base_stat}
                                        <br>
                                        <i class="bi bi-caret-right-fill"></i>
                                        ${pokemon.stats[4].stat.name}:${pokemon.stats[4].base_stat}
                                        <br>
                                        <i class="bi bi-caret-right-fill"></i>
                                        ${pokemon.stats[5].stat.name}:${pokemon.stats[5].base_stat}
                                        <br>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    containerPokemon.appendChild(elemento)
}

fetchPokemons(offsetP,limitP);

//API 2

const containerCocktail = document.querySelector("#container-cocktail")
const spinnerCocktail = document.querySelector("#spinner-cocktail")

let allCocktails = [];
let currentIndex = 0;
const pageSize = 10;

async function fetchCocktailList() {
    spinnerCocktail.style.display = "block";
    try {
        const res = await fetch('https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=Cocktail');
        const dataC = await res.json();
        allCocktails = dataC.drinks;
        showNextCocktails(); 
    } catch (error) {
        containerCocktail.innerHTML = "<p class='text-danger'>Error al cargar los cócteles.</p>";
    } finally {
        spinnerCocktail.style.display = "none";
    }
}

async function fetchCocktailDetails(id) {
    try {
        const res = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`);
        const dataC = await res.json();
        return dataC.drinks[0];
    } catch (error) {
        console.error(`Error al obtener el cóctel con ID ${id}:`, error);
    }
}

async function showNextCocktails() {
    const nextPage = allCocktails.slice(currentIndex, currentIndex + pageSize);
    for (const cocktail of nextPage) {
        const details = await fetchCocktailDetails(cocktail.idDrink);
        if (details) {
            createCocktail(details);
        }
    }

    currentIndex += pageSize;

    if (currentIndex >= allCocktails.length) {
        document.querySelector("#button-cocktail").style.display = "none";
        const noMoreCocktails = document.createElement("div");
        noMoreCocktails.className = "row justify-content-center my-4";
        noMoreCocktails.innerHTML = `
            <div class="col-12">
                <div class="alert alert-warning text-center shadow mt-3">
                    No hay más cócteles para mostrar.
                </div>
            </div>
        `;
        containerCocktail.appendChild(noMoreCocktails);
    }
}

function createCocktail(cocktail) {
    let ingredientes = '';
    for (let i = 1; i <= 15; i++) {
        const ingrediente = cocktail[`strIngredient${i}`];
        const medida = cocktail[`strMeasure${i}`] || '';
        if (ingrediente && ingrediente.trim() !== '') {
            ingredientes += `<li>${medida} ${ingrediente}</li>`;
        }
    }

    let elemento = document.createElement("div")
    elemento.innerHTML = `
        <div class="col">
            <div class="card shadow-sm border-0">
                <button type="button" class="btn p-0" data-bs-toggle="modal" data-bs-target="#flush-${cocktail.idDrink}">
                    <img src="${cocktail.strDrinkThumb}" onerror="this.onerror=null; this.src='./IMG/default-cocktail.png'" class="img-fluid">
                </button>
                <div class="card-body">
                    <h6 class="card-title text-center text-capitalize">
                        ${cocktail.strDrink}
                    </h6>
                </div>
            </div>
            <div class="modal fade" id="flush-${cocktail.idDrink}" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title text-capitalize">
                                ${cocktail.strDrink}
                            </h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <ul class="list-group list-group-flush">
                                <li class="list-group-item">
                                    <div class="text-capitalize">
                                        <b>Copa:</b>${cocktail.strGlass}
                                    </div>
                                </li>
                                <li class="list-group-item">
                                    <b>Ingredientes:</b>
                                    <ul class="list-unstyled">
                                        ${ingredientes}
                                    </ul>
                                </li>
                                <li class="list-group-item">
                                    <b>Instrucciones:</b>${cocktail.strInstructionsES}
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    containerCocktail.appendChild(elemento)
}

fetchCocktailList();
document.querySelector("#button-cocktail").addEventListener("click", showNextCocktails);