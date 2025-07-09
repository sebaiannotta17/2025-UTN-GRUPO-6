function cargarAPI1(){
    const contenedorApi = document.getElementById("contenedorAPI");
    contenedorApi.innerHTML = "cargando número...";
    fetch("http://numbersapi.com/random/trivia")
            .then( res => res.text())
            .then (data =>{
                contenedorApi.innerHTML = ` 
                    <p>${data}</p> `;   
                
            })
            .catch(error => {
                contenedorApi.textContent = "Error al cargar el contenido";
                console.error(error);
            });

}
function cargarAPI2() {
    const contenedorAPI = document.getElementById("contenedorAPI");
    contenedorAPI.textContent = "Obteniendo cotización del peso...";
    fetch("https://v6.exchangerate-api.com/v6/39f1d0db22a73b8ed50f08d4/latest/USD")
    .then(res => res.json())
    .then(data => {
        if (data.result === "success") {
            const tasa = data.conversion_rates.ARS;
            contenedorAPI.innerHTML = `1 USD = ${tasa.toFixed(2)} ARS`;
        } else {
            throw new Error('Datos de cotización no disponibles');
        }
    })
    .catch(error => {
        contenedorAPI.textContent = `Error al obtener la cotización del peso: ${error.message}`;
        console.error("Error de la API:", error);
    });
}



const frases = [
        {texto: "El futuro llegó hace rato", clase:"sombra1"},
        {texto: "Mas vale paso que dure, que trote que canse", clase: "sombra2"},
        {texto: "No hay plata que compre 1 segundo en esta tierra", clase: "sombra3"}
        ];

const seleccion = frases[Math.floor(Math.random() * frases.length)];
const seccionFrases = document.getElementById("frase");
seccionFrases.textContent = seleccion.texto;
seccionFrases.classList.add(seleccion.clase);