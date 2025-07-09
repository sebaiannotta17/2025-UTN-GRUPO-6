// API 1
function obtenerPerro() {
            fetch('https://dog.ceo/api/breeds/image/random')
            .then(respuesta => respuesta.json())
            .then(datos => {
                document.getElementById('perro').src = datos.message;
            });
}

// API 2
function enviarComentario() {
    const texto = document.getElementById('comentario').value;

    fetch('https://jsonplaceholder.typicode.com/comments', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: 'Comentario de prueba',
            body: texto,
            postId: 1
        })
    })
    .then(res => res.json())
    .then(data => {
        document.getElementById('respuesta').textContent = JSON.stringify(data, null, 2);
    });
}

// Frases aleatorias
const frases = [
        { texto: "El conocimiento es poder.", clase: "sombra1" },
        { texto: "Aprender es crecer cada día.", clase: "sombra2" },
        { texto: "Nunca pares de soñar.", clase: "sombra3" }
    ];

    function mostrarFraseAleatoria() {
        const index = Math.floor(Math.random() * frases.length);
        const frase = frases[index];
        const article = document.getElementById("frase");
        article.textContent = frase.texto;
        article.className = frase.clase;
    }
    mostrarFraseAleatoria();
