const frases = [
    "Programar es como escribir un libro... excepto que si te equivocás en una coma, nada funciona.",
    "La programación no se trata solo de código, se trata de creatividad, persistencia y pasión.",
    "El software bien hecho no solo funciona, también mejora vidas."
];

const shadowStyles = [
    "shadow-style-1",
    "shadow-style-2",
    "shadow-style-3"
];

function obtenerFraseAleatoria() {
    const indiceAleatorio = Math.floor(Math.random() * frases.length);
    const estiloAleatorio = shadowStyles[indiceAleatorio];
    
    const contenido = document.getElementById("contenido");
    contenido.textContent = frases[indiceAleatorio];
    
    shadowStyles.forEach(style => {
        contenido.classList.remove(style);
    });
    
    contenido.classList.add(estiloAleatorio);
}

window.onload = function() {
    obtenerFraseAleatoria();
};

function obtenerPerros(done) {
    fetch("https://dog.ceo/api/breeds/image/random")
        .then(response => response.json())
        .then(data => {
            done(data);
        })
        .catch(error => {
            console.error("Error fetching dog image:", error);
        });
}

function obtenerGatos(done) {
    fetch("https://api.thecatapi.com/v1/images/search")
        .then(response => response.json())
        .then(data => {
            done(data);
        })
        .catch(error => {
            console.error("Error fetching cat image:", error);
        });
}

document.getElementById("api1").addEventListener("click", function(event) {
    event.preventDefault();
    
    document.getElementById("api2-content").style.display = 'none';
    document.getElementById("api1-content").style.display = 'block';
    
    const dogContent = document.querySelector('.dog-content');
    dogContent.innerHTML = '<div class="dog-image-container"><img src="" alt="Loading dog image..."></div>';
    dogContent.innerHTML += '<button class="btn" id="btn-dog"><i class="fas fa-sync-alt"></i> Otro Perro</button>';
    
    obtenerPerros(data => {
        document.querySelector('.dog-image-container img').src = data.message;
    });
    
    document.getElementById("btn-dog").addEventListener("click", function() {
        obtenerPerros(data => {
            document.querySelector('.dog-image-container img').src = data.message;
        });
    });
});

document.getElementById("api2").addEventListener("click", function(event) {
    event.preventDefault();
    
    document.getElementById("api1-content").style.display = 'none';
    document.getElementById("api2-content").style.display = 'block';
    
    obtenerGatos(data => {
        const catImgUrl = data[0].url;
        document.getElementById('cat-img-container').style.backgroundImage = `url('${catImgUrl}')`;
    });
    
    document.getElementById("btn-cat").addEventListener("click", function() {
        obtenerGatos(data => {
            const catImgUrl = data[0].url;
            document.getElementById('cat-img-container').style.backgroundImage = `url('${catImgUrl}')`;
        });
    });
});
