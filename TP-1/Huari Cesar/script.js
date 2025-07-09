$(document).ready(function(){
    let frases = [
        '<span class="sombra1">“Hoy no fio mañana si”</span>',
        '<span class="sombra2">“A la grande le puse cuca”</span>',
        '<span class="sombra3">“Se vende agua en polvo”</span>'
    ];
    let fraseAleatoria = frases[Math.floor(Math.random()*frases.length)];
    $('#fraseAleatoria').html(fraseAleatoria);
});

function dog() {
    $.ajax({
        url: 'https://dog.ceo/api/breeds/image/random',
        method: 'GET',
        dataType: 'json',
        success: function(response) {
            ApiResponse(response.message, 'imagen de perro random');
        },
        error: function(req, status, err) {
            console.log(req, status, err);
        }
    });
}

function ApiResponse(data,titulo) {

    var main = document.querySelector('main');

    main.innerHTML = `
        <h1>${titulo}</h1>
        <img src="${data}" alt="Perro aleatorio" style="max-width: 100%; height: auto;">
    `;
}

function cat() {
    $.ajax({
    url: 'https://api.thecatapi.com/v1/images/search',
    method: 'GET',
    datatype: 'json',
    success: function(response) {
        ApiResponse(response[0].url, 'Imagen de gato random');
    },
    error: function(req, status, err){
        console.log(req, status, err);
    }
    });
}

function recargarP(){
    location.reload();
}