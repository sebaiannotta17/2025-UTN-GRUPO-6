

function apiexch() {
    fetch("https://api.coinlayer.com/live?access_key=8c3b131b7b10871dae54340544669db4", {
    method: "GET",
    headers: {
    }
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.rates.BTC);
        const valor = data.rates.BTC;
        const resulEx = document.getElementById("resulEx");
        resulEx.textContent = `Valor actual de BTC: $${valor}`;
    })
    .catch(error => {
        console.error("Hubo un error al obtener los datos:", error.message);
    });
}


function apicats() {
    fetch("https://api.thecatapi.com/v1/images/search?limit=1")
    .then(response => response.json())
    .then(data => {
        console.log(data);
        const imgURL = data[0].url;
        document.getElementById("fotoGatito").src = imgURL;
    })
    .catch(error => {
        console.error("Hubo un error al obtener los datos:", error.message);
    });
}






$(document).ready(function() {
    var frases = [
    {frase: "Seamos dignos nosotros mismos, con nuestros compañeros y con nuestros rivales. Seamos dignos en la victoria y en la derrota" , clase: "primera" },
    {frase: "A la gloria no se llega por un camino de rosas", clase: "segunda" },
    {frase: "Mieren el cielo, agarren una estrella y pongansela en el pecho", clase: "tercera" }
    ];

    tam_array = frases.length;

    nro = Math.floor(Math.random() * tam_array);

    var frase_random = frases[nro];

    $('#frase').text(frase_random.frase).addClass(frase_random.clase);

});
