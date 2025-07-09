// FRASES ALEATORIAS //
const frases = [
    { texto: "HTML NOS BRINDA LOS ELEMENTOS PARA CONSTRUIR UNA PÁGINA WEB.", clase: "sombra1" },
    { texto: "CSS LE DA VIDA A NUESTRA PÁGINA WEB DESDE EL PUNTO DE VISTA ESTÉTICO.", clase: "sombra2" },
    { texto: "JS LE DA VIDA A NUESTRA PÁGINA WEB DESDE  EL PUNTO DE VISTA FUNCIONAL.", clase: "sombra3" }
]
const seleccionada = frases[Math.floor(Math.random() * frases.length)];
const contenedor = document.getElementById("fraseAleatoria");
contenedor.textContent = seleccionada.texto;
contenedor.classList.add(seleccionada.clase);

// FUNCIÓN PARA CONSUMIR API 1 //
document.getElementById("api1").addEventListener("click", function (e) {
    e.preventDefault();
    fetchApi1();
});

function fetchApi1() {
    fetch("https://api.adviceslip.com/advice").then(response => response.json()).then(data => {
        document.getElementById("fraseAleatoria").innerHTML = `Frase de la API 1: "${data.slip.advice}"`;
        document.getElementById("expectativa").textContent = `Fuente: Advice Slip API`;
    }).catch(error => {
        console.error("Error en API 1:", error);
    });
}

// FUNCIÓN PARA CONSUMIR API 2 //
document.getElementById("api2").addEventListener("click", function (e) {
    e.preventDefault();
    fetchApi2();
});

function fetchApi2() {
    fetch("https://dog.ceo/api/breeds/image/random").then(response => response.json()).then(data => {
        document.getElementById("fraseAleatoria").innerHTML = `Imagen de la API 2: <br> <br> <img src="${data.message}" alt="Perro aleatorio" style="max-width: 300px;">`;
        document.getElementById("expectativa").textContent = `Fuente: Dog CEO API`;
    }).catch(error => {
        console.error("Error en API 2:", error);
    });
}