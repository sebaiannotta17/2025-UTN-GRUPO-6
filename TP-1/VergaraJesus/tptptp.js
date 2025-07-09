window.onload = function(){
    const frases = [
        "No es nuestro destino estar encadenados. ¡Somos la Horda! -Garrosh Hellscream, ultimo Warchief",
        "¡El trono de Ventormenta caerá, y sobre sus ruinas alzaremos nuestra bandera! -Garrosh Hellscream, ultimo Warchief",
        "Quemaremos su esperanza. Aplastaremos su orgullo. Y cuando se arrodillen, les daremos muerte. -Sylvanas Windrunner, gloria"
    ];

    const shadows = [
        "2px 2px 4px black",
        "2px 5px 3px blue",
        "4px 5px 3px white"
    ];

    const random = Math.floor(Math.random() * frases.length);

    const frase = document.getElementById("frase");
    frase.textContent = frases[random];
    frase.style.textShadow = shadows[random];
}

function mostrarCaballo() {
    fetch("https://es.wikipedia.org/api/rest_v1/page/summary/Caballo")
        .then(res => res.ok ? res.json() : null)
        .then(data => {
            if (data) {
                document.getElementById('contenido').innerHTML = `
                    <h2>${data.title}</h2>
                    <p>${data.extract}</p>
                    <img src="${data.thumbnail?.source}" alt="Caballo" width="300">
                `;
            }
        });
}

function mostrarLeon() {
    fetch("https://es.wikipedia.org/api/rest_v1/page/summary/León")
        .then(res => res.ok ? res.json() : null)
        .then(data => {
            if (data) {
                document.getElementById('contenido').innerHTML = `
                    <h2>${data.title}</h2>
                    <p>${data.extract}</p>
                    <img src="${data.thumbnail?.source}" alt="León" width="300">
                `;
            }
        });
}



