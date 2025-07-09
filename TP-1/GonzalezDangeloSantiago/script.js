$(document).ready(function () {
    const frases = [
        { texto: "¡Hola mundo!", class: "sombra1" },
        { texto: "Bienvenido a mi pagina web", class: "sombra2" },
        { texto: "Espero promocionar la materia", class: "sombra3" }
    ];

    const indice = Math.floor(Math.random() * frases.length);
    const frase = frases[indice];

    $('#frase')
        .text(frase.texto)
        .removeClass('sombra1 sombra2 sombra3')
        .addClass(frase.class);

    $('#api1').on('click', function (e) {
        e.preventDefault();
        $.ajax({
            url: 'https://emojihub.yurace.pro/api/random',
            method: 'GET',
            dataType: 'json',
            success: function (data) {
                // Mostramos solo el emoji
                $('#resultado1').html(`<span style="padding-left: 1.5em;"> El emoji del dia es: </span><br>
                    <p style="font-size: 3rem; padding-left: 1.5em;">${data.htmlCode[0]}</p>
                `);
            },
            error: function () {
                $('#resultado1').html('<p>Error al cargar el emoji.</p>');
            }
        });
    });

    $('#api2').on('click', function(e) {
        e.preventDefault();
        $.ajax({
            url: 'https://dog.ceo/api/breeds/image/random',
            method: 'GET',
            dataType: 'json',
            success: function(data) {
                if(data.status === "success") {
                    $('#resultado2').html(`<span style="padding-left: 1.5em;"> La imagen de perros del dia es: </span><br>
                        <img style="padding-left: 1.5em;" src="${data.message}" alt="Perro aleatorio" style="max-width: 100%; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.3);">
                    `);
                } else {
                    $('#resultado2').html('<p>No se pudo cargar la imagen.</p>');
                }
            },
            error: function() {
                $('#resultado2').html('<p>Error al cargar la imagen.</p>');
            }
        });
    });

});
