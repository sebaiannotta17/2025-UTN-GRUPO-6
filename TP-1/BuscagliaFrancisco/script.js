const textos = [
    "Todo lo que vemos en el espacio está en el pasado, ya que la luz necesita tiempo para viajar largas distancias.",
    "Algunas galaxias pueden 'comerse' a otras a través de la colisión y fusión, lo que resulta en la formación de galaxias más grandes. ",
    "Un día en Venus dura más que un año en Venus, debido a su lenta rotación sobre su eje.",
];

const expectativas = "Mi expectativa en la cursada es aprender la base para poder empezar a crear páginas web.";

const sombras = [
    "2px 2px 5px red",
    "1px 1px 3px blue",
    "0 0 8px green"
];

const contenido = document.getElementById("contenido");


//Carga el texto aleatorio con su sombreado
function mostrarInicio() {
    contenido.innerHTML = '';
    const fraseP = crearFraseAleatoria();
    const expectativa = document.createElement("p");
    expectativas.id = "expectativas";
    expectativa.textContent = expectativas;
    fraseP.id = "fraseAleatoria";
    contenido.appendChild(fraseP);
    contenido.appendChild(expectativa);
}

//Elige una de las 3 frases
function crearFraseAleatoria(){
    const texto = Math.floor(Math.random() * textos.length);
    const color = colorAleatorio();
    const frase = document.createElement("p");
    frase.textContent = textos[texto];
    frase.style.color = color;
    frase.style.textShadow = sombras[texto];
    return  frase;
}

//Crea un color aleatorio
function colorAleatorio() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
}

//Muestra el contenido de la API1
async function mostrarJuego() {
    contenido.innerHTML = '';
    const api1 = 'https://corsproxy.io/?https://www.freetogame.com/api/games';
    
    try {
        const response = await fetch(api1);
        
        if (!response.ok) {
            throw new Error(`Error al obtener los datos: ${response.status} ${response.statusText}`);
        }
        const juegos = await response.json();
        if (!juegos || juegos.length === 0) {
            contenido.innerHTML = '<p>No se encontraron juegos.</p>'
            return;
        }

        const juegoRandom = Math.floor(Math.random() * juegos.length);
        const juegoElegido = juegos[juegoRandom];
        
        const nombre = juegoElegido.title;
        const imagen = juegoElegido.thumbnail;
        const descripcion = juegoElegido.short_description;
        const genero = juegoElegido.genre;
        const desarrolladora = juegoElegido.developer;
        const fechaLanzamiento = juegoElegido.release_date;

        contenido.innerHTML = `
            <div id="api1">
                <div id="foto_titulo">
                    <img src="${imagen}" alt="Foto juego" id="foto">
                    <p>${nombre}</p>
                </div>
            
                <div id="datos">
                    <ul>
                        <li><b>Descripción: </b>${descripcion}</li>
                        <li><b>Género: </b>${genero}</li>
                        <li><b>Desarrolladora: </b>${desarrolladora}</li>
                        <li><b>Fecha de lanzamiento: </b>${fechaLanzamiento}</li>
                    </ul>
                </div>
            </div>
        `;
    }
    catch (error) {
        console.error('Error al mostrar el juego aleatorio:', error);
        contenido.innerHTML = `<p style="color: red;">No se pudo cargar la información del juego. ${error.message}</p>`;
    }
}

//Muestra el contenido de la API2
async function mostrarChiste(){
    contenido.innerHTML = '';
    const api2 = 'https://corsproxy.io/?https://v2.jokeapi.dev/joke/Any?lang=es&type=single';

    try{
        const response = await fetch(api2);
        if (!response.ok) {
            throw new Error(`Error al obtener los datos: ${response.status} ${response.statusText}`);
        }
        const chiste = await response.json();
        if (!chiste || chiste.length === 0) {
            contenido.innerHTML = '<p>No se encontraron chistes.</p>'
            return;
        }
        

        contenido.innerHTML =  `
            <div id="api2">
                <h2><b>${chiste.joke}</b></h2>
                <p>😂🙏😂🙏😂🙏😂🙏😂🙏😂🙏😂🙏😂🙏😂🙏😂🙏😂🙏😂🙏😂🙏😂🙏😂🙏😂🙏😂</p>
                <button onclick="cargar_api2()">Cargar otro chiste</button><br>
            </div>
        `
    }
    catch (error) {
        console.error('Error al mostrar el chiste aleatorio:', error);
        contenido.innerHTML = `<p style="color: red;">No se pudo cargar el chiste. ${error.message}</p>`;
    }
}

//Creo eventListeners
document.addEventListener("DOMContentLoaded", () => {
    mostrarInicio();
    const home = document.getElementById("enlace_inicio");
    const api1 = document.getElementById("API1");
    const api2 = document.getElementById("API2");

    api1.addEventListener("click", mostrarJuego);
    api2.addEventListener("click", mostrarChiste);
    home.addEventListener("click", mostrarInicio);

});