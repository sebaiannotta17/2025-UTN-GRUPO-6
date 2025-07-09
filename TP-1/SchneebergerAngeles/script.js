window.onload = function() {
    var num = Math.random(); // función que da un número entre 0 y 1

    if (num < 0.33) {
        sombra = '<p class="opcion1">Frase con sombra roja, usando CSS3</p>';
    } else if (num < 0.66) {
        sombra = '<p class="opcion2">Frase con sombra verde, usando CSS3</p>';
    } else {
        sombra = '<p class="opcion3">Frase con sombra amarilla, usando CSS3</p>';
    }
    document.getElementById("fraseconsombra").innerHTML = sombra;
};

function obtenerDato() {
    document.getElementById("fact").innerHTML = "Cargando...";

    $.ajax({
        url: 'https://uselessfacts.jsph.pl/api/v2/facts/random?language=en',
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            document.getElementById("fact").innerHTML = "<u>Dato curioso:</u> " + data.text;
        },
        error: function() {
            document.getElementById("fact").innerHTML = "Error";
        }
        });
}

function obtenerReceta() {
            document.getElementById("receta").innerHTML = "Cargando...";

            $.ajax({
                url: "https://www.themealdb.com/api/json/v1/1/random.php",
                method: 'GET',
                success: function(data) {
                    const comida = data.meals[0];
                    document.getElementById("receta").innerHTML = '<u>Nombre receta:</u><br>' + comida.strMeal 
                     + '<br><br> <u>Instrucciones:</u><br>' + comida.strInstructions;
                },
                error: function() {
                    document.getElementById("receta").innerHTML = "Error";
                }
            });
}
