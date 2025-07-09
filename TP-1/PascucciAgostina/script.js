window.onload = function() {
    

const frases = [
    {frase: "No es soberbia, es amor. Poder decir adiós, es crecer - Gustavo Cerati", clase: "fNumero1" },
    {frase: "Será la vida que siempre nos pega un poco, nos encandila con lo que esta por venir - Los Piojos", clase: "fNumero2"},
    {frase: "No olvides que el perdón es lo divino y errar, a veces, suele ser humano - Fito Paez", clase: "fNumero3"}];

    const contFrases = document.getElementById("frases");
    const fraseAleatoria = frases[Math.floor(Math.random()*frases.length)];
    const p = document.createElement("p");
    p.textContent = fraseAleatoria.frase;
    p.className = fraseAleatoria.clase;
    contFrases.appendChild(p);
};

function cargarAPI1() {
    const contApi = document.getElementById('api');
    contApi.innerHTML = "Cargando imagen...";

    fetch('https://random.dog/woof.json')
        .then(response => response.json())
        .then(data => {
            // Filtramos si es imagen, no video
            if (data.url.endsWith(".mp4") || data.url.endsWith(".webm")) {
                contApi.innerHTML = "El archivo recibido no es una imagen. Intenta de nuevo.";
                return;
            }

            const img = document.createElement("img");
            img.src = data.url;
            img.alt = "Animal aleatorio";
            img.style.border = "2px solid #333";
            img.style.marginTop = "1em";
            img.style.maxWidth = "100%";

            contApi.innerHTML = "";
            contApi.appendChild(img);
        })
        .catch(err => {
            contApi.innerHTML = "Error al cargar la imagen.";
            console.error(err);
        });
}


// Cargar dato curioso de gato
function cargarAPI2() {
    const contApi = document.getElementById('api');
    contApi.innerHTML = "Cargando dato...";

    fetch('https://catfact.ninja/fact')
        .then(response => response.json())
        .then(data => {
            contApi.innerHTML = `<p style="margin-top:1em; font-style:italic;">🐱 Dato de gato: ${data.fact}</p>`;
        })
        .catch(err => {
            contApi.innerHTML = "Error al obtener dato.";
            console.error(err);
        });
}





