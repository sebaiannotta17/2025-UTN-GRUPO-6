var frases=["en casa de herrero cuchillo de palo","no hay mal que por bien no venga","mas vale pajaro en mano que 10mil volando"]

function mostrar_FA(){
    var indice=Math.floor(Math.random() * frases.length);
    var seleccionada=frases[indice];
    document.getElementById("frase-aleatoria").textContent=seleccionada;
}

window.addEventListener("DOMContentLoaded", mostrar_FA);

let currentFact = '';

function catDato() {
    fetch('https://catfact.ninja/fact')
    .then(response => response.json())
    .then(data => {
        currentFact = data.fact;
        document.getElementById('dato').innerText = currentFact;
                  })
        .catch(error => {
        console.error('Error al obtener el dato:', error);
        document.getElementById('dato').innerText = 'No se pudo cargar el dato.';
    });
}
        
function mostrarFotoGato() {
    fetch('https://api.thecatapi.com/v1/images/search')
    .then(response => response.json())
    .then(data => {
        const imageUrl = data[0].url;
        document.getElementById('catImage').src = imageUrl;
    })
.catch(error => {
    console.error('Error al cargar imagen:', error);
    document.getElementById('catImage').alt = 'No se pudo cargar la imagen.';
    });
}          
