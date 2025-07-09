function mostrarFraseInicial() {
    const frases = [
        "Escribe código que incluso un perro pueda entender.",
        "Un perro nunca te juzga, a diferencia de un compilador.",
        "Las ranas han caído del cielo en varios países."
    ]; //array con las frases aleatorias
    const colores = [
        "2px 2px 5px red",
        "2px 2px 5px blue",
        "2px 2px 5px green"
    ]
    const numRandom = Math.floor(Math.random() * frases.length);
    const fraseElem = document.getElementById('fraseInicial');

    fraseElem.textContent = frases[numRandom];
    fraseElem.style.textShadow = colores[numRandom]

}

function cargarClima(ciudad){
    const APIKEY = '6e4befa0cbb5a443d33782894ecd0735';
    const URL = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},AR&units=metric&lang=es&appid=${APIKEY}`

    fetch(URL)

    .then (Response => {
        if(!Response.ok){
            throw new Error("ciudad no encontrada");
        }
        return Response.json();
    })
    .then (data => {
        const resultado = `
        <p>Ciudad: ${data.name}</p>
        <p>Temperatura: ${data.main.temp} °C</p>
        <p>Clima: ${data.weather[0].description}</p>
        <p>Viento: ${data.wind.speed} m/s</p>
        `;
        document.getElementById('apiResult').innerHTML = resultado;
    })

}

function mostrarFotoPerro(){
    fetch('https://dog.ceo/api/breeds/image/random')
        .then (Response => {
            if (!Response.ok){
                throw new Error ("No se pudo cargar la imagen del perro");
            }
            return Response.json();
        })
        .then (data => {
            const imgURL = data.message;
            document.getElementById('apiResult').innerHTML = `<img src="${imgURL}">`;
        })
}