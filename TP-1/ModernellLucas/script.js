function fetchAPI(url) {
fetch(url)
.then(response => response.json())
.then(data => {
    let content = "";
    if (url.includes("breakingbadquotes")) {
        const quoteObj = data[0];
        content = `<p>"${quoteObj.quote}" — <strong>${quoteObj.author}</strong></p>`;
    } else if (url.includes("dog.ceo")) {
        content = `<img src="${data.message}" alt="Perro aleatorio" width="300"/>`;
    }
    document.getElementById("contenidoAPI").innerHTML = content;
    })
.catch(error => {
    document.getElementById("contenidoAPI").innerHTML = "<p>Error al obtener datos</p>";
    console.error(error);
    });
}

window.onload = function () {
const frases = [
    { text: "La ingeniería construye el mundo.", class: "shadow1" },
    { text: "El conocimiento impulsa la sociedad.", class: "shadow2" },
    { text: "Cada línea de código transforma realidades.", class: "shadow3" },
];
const random = frases[Math.floor(Math.random() * frases.length)];
document.getElementById("frase").innerHTML = `<p class="${random.class}">${random.text}</p>`;
};