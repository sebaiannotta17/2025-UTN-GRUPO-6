let frases = [
    { texto: "Frase Aleatoria NRO: 1", sombra: "2px 2px 5px red" },
    { texto: "Frase Aleatoria NRO: 2", sombra: "2px 2px 5px green" },
    { texto: "Frase Aleatoria NRO: 3", sombra: "2px 2px 5px blue" }
];
function mostrarFraseInicial() {
    let contenedor = document.getElementById('contenido');
    let indice = Math.floor(Math.random() * frases.length);
    let frase = frases[indice];

    contenedor.innerHTML = `
        <p style="font-size: 20px; text-shadow: ${frase.sombra};">${frase.texto}</p>
        <p><strong>Expectativa:</strong> Espero adquirir las habilidades necesarias para crear sitios web funcionales y modernos usando HTML, CSS y JavaScript.</p>
    `;
}
function mostrarPerro() {
    let contenedor = document.getElementById('contenido');
    contenedor.innerHTML = `
        <h2>Perro simpático</h2>
        <img src="https://images.dog.ceo/breeds/shiba/shiba-11.jpg" alt="Perro" style="max-width:100%;">
        <p>Este es un perro de la raza Shiba Inu.</p>
    `;
}
function mostrarWikipedia() {
    let contenedor = document.getElementById('contenido');
    contenedor.innerHTML = '<p>Cargando información...</p>';

    fetch('https://es.wikipedia.org/api/rest_v1/page/summary/Segunda_Guerra_Mundial')
        .then(res => res.json())
        .then(data => {
            contenedor.innerHTML = `
                <h2>${data.title}</h2>
                <p>${data.extract}</p>
                <a href="${data.content_urls.desktop.page}" target="_blank">Leer más en Wikipedia</a>
            `;
        })
        .catch(() => {
            contenedor.innerHTML = '<p>Error al cargar el artículo de Wikipedia.</p>';
        });
}
window.onload = mostrarFraseInicial;