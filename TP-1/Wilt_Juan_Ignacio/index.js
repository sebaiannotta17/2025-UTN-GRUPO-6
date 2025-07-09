$(document).ready(function() {
    cambiarEstilo();
    $('#gato').click(function() {
        $.ajax({
            url: 'https://api.thecatapi.com/v1/images/search',
            method: 'GET',
            success: function(data) {
                $('#contenido').html('<h2>Gato Aleatorio</h2>');
                const img = $('<img>').attr('src', data[0].url).css('max-width', '100%');
                $('#contenido').append(img);
            },
            error: function() {
                $('#contenido').html('<p>Error al cargar la imagen de gato.</p>');
            }
        });
        
    });
    
    $('#perro').click(function() {
        $.ajax({
            url: 'https://dog.ceo/api/breeds/image/random',
            method: 'GET',
            success: function(data) {
                $('#contenido').html('<h2>Perro Aleatorio</h2>');
                const img = $('<img>').attr('src', data.message).css('max-width', '100%');
                $('#contenido').append(img);
            },
            error: function() {
                $('#contenido').html('<p>Error al cargar la imagen de perro.</p>');
            }
        });
    });
});


function cambiarEstilo(){
    const numero = Math.floor(Math.random() * 3);
    const frases = [
        "El perro es el mejor amigo del hombre",
        "Estoy programando en JavaScript",
        "Hoy es un día soleado"
    ];
    $('#fraseAleatoria').removeClass('estilo1 estilo2 estilo3');
    $('#fraseAleatoria').addClass('estilo' + (numero + 1));
    $('#fraseAleatoria').text(frases[numero])
}