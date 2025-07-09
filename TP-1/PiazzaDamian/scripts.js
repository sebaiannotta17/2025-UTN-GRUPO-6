document.addEventListener("DOMContentLoaded", function () {
    const frases = [
        {
            texto: "La programacion es el arte de pensar para resolver.",
            clase: "frase-1"
        },
        {
            texto: "Cada error es una oportunidad para aprender.",
            clase: "frase-2"
        },
        {
            texto: "El codigo claro es mejor que el codigo complejo.",
            clase: "frase-3"
        }
    ];

    const contenedor = document.querySelector(".container-frase");
    const aleatoria = frases[Math.floor(Math.random() * frases.length)];

    contenedor.textContent = aleatoria.texto;
    contenedor.classList.add(aleatoria.clase);
});

async function cargarConsejo() {
        try {
            const respuesta = await fetch("https://api.adviceslip.com/advice");
            const data = await respuesta.json();
            const consejo = data.slip.advice;

            document.querySelector(".container-api").textContent = consejo;
        } catch (error) {
            document.querySelector(".container-api").textContent = "Error al obtener el consejo.";
            console.error(error);
        }
}

async function cargarImagenPerro() {
        try {
            const respuesta = await fetch("https://dog.ceo/api/breeds/image/random");
            const data = await respuesta.json();
            const urlImagen = data.message;

            const img = document.createElement("img");
            img.src = urlImagen;
            img.alt = "Imagen de un perro aleatorio";
            img.style.maxWidth = "100%";
            img.style.height = "auto";

            const contenedor = document.querySelector(".container-api");
            contenedor.innerHTML = "";
            contenedor.appendChild(img);
        } catch (error) {
            document.querySelector(".container-api").textContent = "No se pudo cargar la imagen.";
            console.error(error);
        }
}