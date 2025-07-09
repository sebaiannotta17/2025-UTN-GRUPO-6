$(document).ready(function() {
    $('#linkJoke').click(function() {
        $.ajax({
            url: 'https://official-joke-api.appspot.com/random_joke',
            method: 'GET',
            success: function(data) {
                $('#contenido').html('<h2>Chiste Aleatorio</h2>');
                $('#contenido').append('<p><strong>' + data.setup + '</strong></p>');
                $('#contenido').append('<p>' + data.punchline + '</p>');
            },
            error: function() {
                $('#contenido').html('<p>Error al cargar el chiste.</p>');
            }
        });
    });

    $('#linkUser').click(function() {
        $.ajax({
            url: 'https://randomuser.me/api/',
            method: 'GET',
            success: function(data) {
                let user = data.results[0];
                $('#contenido').html('<h2>Usuario Aleatorio</h2>');
                $('#contenido').append('<p>Nombre: ' + user.name.first + ' ' + user.name.last + '</p>');
                $('#contenido').append('<p>País: ' + user.location.country + '</p>');
                $('#contenido').append('<img src="' + user.picture.medium + '" alt="Foto de usuario" style="max-width:100%;">');
            },
            error: function() {
                $('#contenido').html('<p>Error al cargar el usuario.</p>');
            }
        });
    });

    let frase = [
        "Hoy una etiqueta <div>, mañana un imperio digital.",
        "Algunos ven errores, yo veo respawns.",
        "Que la fuerza del código te acompañe"
        //Frases candidatas:
        //I'm Groot... pero ahora también sé programar.
        //Keep calm and respawn en el código.
        //Level up: aprendiendo a crear el futuro de la web.
        //El error 404 no es una caída, ¡es un checkpoint!
        //Cada línea de código es un paso más cerca del futuro.
        //Si puedes soñarlo, puedes programarlo.
    ];

    let indice = Math.floor(Math.random() * frase.length);

    let fraseElemento = document.getElementById('fraseRandom');
    fraseElemento.innerText = frase[indice];

    fraseElemento.classList.remove('sombra1', 'sombra2', 'sombra3');
    fraseElemento.classList.add('sombra' + (indice + 1));
});