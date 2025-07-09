window.onload = function() {
    var frases = [
        '<p class="sombra1">"La tecnología es el futuro que programamos."</p>',
        '<p class="sombra2">"Todo gran código comienza con una idea simple."</p>',
        '<p class="sombra3">"Aprender a programar es aprender a crear."</p>'
    ];

    var indice = Math.floor(Math.random() * frases.length);
    var contenido = document.getElementById("contenido");
    contenido.innerHTML = frases[indice];
    contenido.innerHTML += `
        <p>
            En esta cátedra espero adquirir herramientas para trabajar con tecnologías web modernas,
            mejorar mis habilidades en desarrollo frontend y comprender mejor el trabajo con APIs.
        </p>
    `;
};

// Función para cargar APIs
function cargarAPI(apiNum) {
    var contenedor = document.getElementById("contenido");

    if (apiNum === 1) {
        // Lista de temas variados
        var temas = [
            "historia", "ciencia ficción", "filosofía", "arte", "música",
            "astronomía", "novela", "poesía", "humor", "mitología",
            "psicología", "biología", "deportes", "política", "JavaScript",
            "HTML", "CSS", "React", "Python", "web", "database"
        ];

        var indice = Math.floor(Math.random() * temas.length);
        var temaSeleccionado = temas[indice];

        // API Open Library: buscar libros por tema
        var url = "https://openlibrary.org/search.json?q=" + encodeURIComponent(temaSeleccionado);

        fetch(url)
            .then(function(respuesta) {
                return respuesta.json();
            })
            .then(function(datos) {
                var salida = "<h2>Libros sobre <em>" + temaSeleccionado + "</em>:</h2><ul>";
                for (var i = 0; i < 5 && i < datos.docs.length; i++) {
                    var libro = datos.docs[i];
                    salida += "<li><strong>" + libro.title + "</strong> - " +
                    (libro.author_name ? libro.author_name[0] : "Autor desconocido") + "</li>";
                }
                salida += "</ul>";
                contenedor.innerHTML = salida;
            })
            .catch(function(error) {
                contenedor.innerHTML = "Error al cargar los libros.";
            });
    }
    else if (apiNum === 2) {
        // API Open Trivia: obtener una pregunta aleatoria y su respuesta
        fetch("https://opentdb.com/api.php?amount=1")
            .then(function(respuesta) {
                return respuesta.json();
            })
            .then(function(datos) {
                var pregunta = datos.results[0];
                var salida = "<h2>Pregunta de Trivia:</h2>";
                salida += "<p><strong>" + pregunta.question + "</strong></p>";
                salida += "<p><em>Categoría:</em> " + pregunta.category + "</p>";
                salida += "<p><em>Dificultad:</em> " + pregunta.difficulty + "</p>";
                salida += "<p><em>Respuesta correcta:</em> " + pregunta.correct_answer + "</p>";
                contenedor.innerHTML = salida;
            })
            .catch(function(error) {
                contenedor.innerHTML = "Error al cargar la pregunta.";
            });
    }
}