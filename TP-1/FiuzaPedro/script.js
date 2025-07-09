window.onload = function() {
    const frases = [
        "Sangrarás y sanarás esa herida, llorarás y cerrarás esa herida - Wos, Nuevas Coordenadas",
        "¿Con que mentira vendes tu verdad? - Wos, Nuevas Coordenadas",
        "A lo sumo uso esta vida como fe de erratas - Wos, Morfeo"
    ];

    const sombras = [
        "2px 2px 4px #333",
        "3px 3px 5px #ff0000",
        "4px 4px 6px #0033ff"
    ];

    const random = Math.floor(Math.random() * frases.length);

    const frase = document.getElementById("frase");
    frase.textContent = frases[random];
    frase.style.textShadow = sombras[random];
};

function mostrarAPI1() {
    fetch('https://dog.ceo/api/breeds/image/random')
        .then(res => res.json())
        .then(data => {
            document.getElementById('contenido').innerHTML = `
                <h2>Perro aleatorio</h2>
                <img src="${data.message}" alt="Perro" style="max-width: 400px;">
            `;
        });
}

function mostrarWos() {
    const imagenesWos = [
        "https://i.imgur.com/StuYEFb.jpeg",
        "https://i.imgur.com/eImQrSs.jpeg",
        "https://i.imgur.com/dn98tTy.jpeg"
    ];

    const random = Math.floor(Math.random() * imagenesWos.length);

    document.getElementById('contenido').innerHTML = `
        <h2>Wos aleatorio</h2>
        <img src="${imagenesWos[random]}" alt="Wos" style="max-width: 400px;">
    `;
}
