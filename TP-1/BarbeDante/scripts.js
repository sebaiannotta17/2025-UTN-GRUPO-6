$(document).ready(function(){
    $("#api_lyrics").click(function(){
        Lyricsovh('Bob Marley', 'Is this love')   
    });
    
    const apiKeyFutbolF1 = '7458314d9bb14196f94c9e5eb1e4f2d2';
    $('#api_futbol').click(function(){
        apiFutbol(apiKeyFutbolF1);
    })

    $('#api_f1').click(function(){
        apiF1(apiKeyFutbolF1);
    })

    const api_key='75f3c01e23f819264c8bb2b1f5df45a6';
    $('#api_clima').click(function(){
        openWeather('Verónica', api_key);
    })
})

async function Lyricsovh(artista, cancion) {
    
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };
    try {
        const response = await fetch(`https://api.lyrics.ovh/v1/${artista}/${cancion}`, requestOptions);
        const result = await response.json();
        $('#apiResponse').empty();
        $('#apiResponse').append('<h2>Api Response Lyrics.ovh</h2>')
        $('#apiResponse').append(`<p>${result.lyrics}</p>`)
    } catch (error) {
        console.error('error', error);
        $('#apiResponse').text('Ocurrió un error. Por favor intente denuevo.');
    }
}

function openWeather(city_name, api_key){
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city_name}&appid=${api_key}&units=metric`)
    .then(response => response.json())
    .then(response => mostrarDatosClima(response, city_name))
}
function mostrarDatosClima(response, city_name){
    $('#apiResponse').empty();
    
    const temperatura = response.main.temp
    const descripcion = response.weather[0].description
    const icono = response.weather[0].icon
    
    $('#apiResponse').append('<h2>Api Response Open Weather</h2>');
    $('#apiResponse').append(`<p>La temperatura en ${city_name} es de ${temperatura}°C</p>`);
    $('#apiResponse').append(`<img src=https://openweathermap.org/img/wn/${icono}@2x.png>`);
    $('#apiResponse').append(`<p>Descripción: ${descripcion}`);
}

async function apiF1(apiKeyFutbolF1) {
    var id_piloto = Math.floor(Math.random() * 111);
    var myHeaders = new Headers();
    myHeaders.append("x-rapidapi-key", apiKeyFutbolF1);
    myHeaders.append("x-rapidapi-host", "v1.formula-1.api-sports.io");
    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    try {
        const response = await fetch(`https://v1.formula-1.api-sports.io/drivers?id=${id_piloto}`, requestOptions);
        const result = await response.json();
        const piloto = result.response[0];
        
        $('#apiResponse').empty();
        $('#apiResponse').append('<h2>Api Response F1</h2>');

        $('#apiResponse').append("<div id='container'></div>");
        $('#container').css({
            "display" : "flex",
            "aling-items" : "center"
        });

        $('#apiResponse').append(`<img src=${piloto.image} alt=${piloto.name}>`);
        $('#apiResponse img').css({
            "width " : "100px",
            "height" : "auto",
            "margin-right" : "10px"

        });

        $('#apiResponse').append(`<p>
                ${piloto.name}, ${piloto.country.name}, ${piloto.birthdate}, ${piloto.teams[0].team.name}, mejor posición: ${piloto.highest_grid_position}
            </p>`);

    } catch (error) {
        console.error('error', error);
    }
}

async function apiFutbol(apiKeyFutbolF1){
    var id_club = Math.floor(Math.random() * 26047);
    var myHeaders = new Headers();
    myHeaders.append("x-rapidapi-key", apiKeyFutbolF1);
    myHeaders.append("x-rapidapi-host", "v3.football.api-sports.io");

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };
//453 = Independiente
    try {
        const response = await fetch(`https://v3.football.api-sports.io/teams?id=${id_club}`, requestOptions);
        const result = await response.json();
        const equipo = result.response[0];
        console.log(result);
        
        $('#apiResponse').empty();
        $('#apiResponse').append('<h2>Api Response Futbol</h2>');

        $('#apiResponse').append("<div id='equipoContainer'></div>");
        $('#equipoContainer').css({
            "display" : "flex",
            "align-items" : "center",
            "box-sizing" : "border-box"
        });
        $('#apiResponse').append(`<img src=${equipo.team.logo} alt=${equipo.team.name}>`);
        $('#apiResponse img').css({
            "width" : "150px",
            "height" : "auto",
            "margin-right" : "10px"
        })

        $('#apiResponse').append(`<p>
            ${equipo.team.name}, fundado en ${equipo.team.founded}, ${equipo.venue.city}, ${equipo.team.country} - Estadio: ${equipo.venue.name}, capacidad: ${equipo.venue.capacity}
            </p>`);

      } catch (error) {
          console.error('error', error);
      }
  }

let frases = [
    "El infierno esta encantador",
    "El Rey de Copas",
    "Estadio Libertadores de América - Ricardo Enrique Bochini"
];
var numero = Math.floor(Math.random() * 3);

$('article').prepend(`<p id='frase'>${frases[numero]}</p>`);

switch (numero) {
    case 0:
        $('#frase').addClass('frase1');          
        break;
    case 1:
        $('#frase').addClass('frase2');          
        break;
    case 2:
        $('#frase').addClass('frase3');          
        break;
}        