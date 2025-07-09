const frases = [
    {
        texto:"Los programas deben escribirse para que los lean las personas, y solo de forma incidental para que los ejecuten las máquinas.",
        clase: "frase-1"
    } ,
    {
        texto:"Primero, resuelve el problema. Luego, escribe el código.",
        clase: "frase-2"
    },
    {
        texto:"La simplicidad es la máxima sofisticación.",
        clase:"frase-3"
    }
]
document.addEventListener("DOMContentLoaded", function() {
    const contenedor = document.querySelector('#container-frase');
    const aleatoria = frases[Math.floor(Math.random() * frases.length)];

    contenedor.textContent = aleatoria.texto;
    contenedor.classList.add(aleatoria.clase);
});

async function obtenerGif() {
    try {
        const response = await fetch('https://yesno.wtf/api');
        if (!response.ok) {
            throw new Error('Error en la respuesta' + response.status);
        }
        const data = await response.json();
        const image = data.image;

        document.getElementById('container-api').innerHTML = '<img src="' + image + '" alt="Imagen del clima">';


    } catch (error) {
        document.getElementById('container-api').innerHTML = '<p>error al obtener la api</p>';
        console.error('Error:', error);
    }
}

async function obtenerImagenPerro(){
    try {
        const response = await fetch('https://dog.ceo/api/breeds/image/random')
        const data = await response.json();
        if (!response.ok) {
            throw new Error('Error en la respuesta: ' + response.status);
        }
        const image = data.message;
        document.getElementById('container-api').innerHTML = '<img src="' + image + '" alt="Imagen de un perro">';
    } catch (error) {
        document.getElementById('container-api').innerHTML = '<p>error al obtener la api</p>';
        console.error('Error:', error);
    }
}