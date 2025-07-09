var frases = ["Hola soy Maxi","A la gloria no se llega por un camino de rosas..","Vamos leon"];
var sombras = [
    "2px 2px 5px red",
    "2px 2px 5px green",
    "2px 2px 5px black"
];

window.onload = function(){
    let i = Math.floor(Math.random() * frases.length); 
    let aleatoria = frases[i];
    let fa = document.getElementById("fRandom");
    fa.textContent = aleatoria;
    fa.style.textShadow = sombras[i]; 
};

function mostrarPokemon() {
    fetch('https://pokeapi.co/api/v2/pokemon/pikachu')
        .then(res => res.json())
        .then(data => {
        document.getElementById("apiResultado").innerHTML =
            `<h3>${data.name.toUpperCase()}</h3>
            <img src="${data.sprites.front_default}" alt="${data.name}">`;
        });
    }

    function mostrarGato() {
        fetch('https://api.thecatapi.com/v1/images/search')
        .then(res => res.json())
        .then(data => {
        document.getElementById("apiResultado").innerHTML =
            `<img src="${data[0].url}" alt="Gato aleatorio">`;
        });
    }