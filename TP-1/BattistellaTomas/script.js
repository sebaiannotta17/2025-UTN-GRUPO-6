const frases = [
    "La práctica hace al programador.",
    "El mejor código es el que no se escribe dos veces.",
    "Error al cargar... mentira funciona bien."
];

const styles = [
    "text-shadow: 3px 3px 3px red",
    "text-shadow: 3px 3px 3px blue",
    "text-shadow: 3px 3px 3px green"
]

function showAleatoryFrase(frases, styles) {
    let i = Math.floor(Math.random() * frases.length);
    let elemento = document.getElementById("frase");
    elemento.innerHTML = frases[i];
    elemento.style.cssText = styles[Math.floor(Math.random() * styles.length)];
}

function ocultarPrincipal() {
    principal = document.getElementById("inicial");
    principal.style.display = "none";
    document.getElementById("contenido-apis").innerHTML = "";
}

function getWeatherIcon(code){
    switch(true){
        case code === 0:
            return "<img src='recursos/sunny_day.png' alt='Dia soleado' width='50'>"
        case code >= 1 && code <= 3:
            return "<img src='recursos/partially_cloudy.png' alt='Parcialmente nublado' width='50'>";
        case code >= 45 && code <= 48:
            return "<img src='recursos/cloudy.png' alt='Neblina' width='50'>";
        case code >= 51 && code <= 67:
            return "<img src='recursos/rainy.png' alt='Lluvia' width='50'>";
        case code >= 71 && code <= 77:
            return "<img src='recursos/snowy.png' alt='Nieve' width='50'>";
        case code >= 80 && code <= 82:
            return "<img src='recursos/rainy_2.png' alt='Lluvia intensa' width='50'>";
        case code === 95:
            return "<img src='recursos/thunder_storm.png' alt='Tormenta eléctrica' width='50'>";
        case code >= 96 && code <= 99:
            return "<img src='recursos/hail.png' alt='Tormenta con granizo' width='50'>";
        default:
            return "<img src='recursos/unknown_code.png' alt='Desconocido' width='50'>";
    }
}

function createWeatherCard(nombrePais, lat, long) {    
    const api_clima = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&current_weather=true`;
    
    fetch(api_clima)
        .then(response => response.json())
        .then(data => {
            const clima = data.current_weather;
            const icono = getWeatherIcon(clima.weathercode);
            const tarjeta = `
            <div id="weather_card">
                ${icono}
                <strong>Clima en ${nombrePais}</strong>
                Temperatura: ${clima.temperature} °C <br>
                Viento: ${clima.windspeed} km/h <br>
                Hora del dato: ${clima.time.replace("T", " a las ")} 
            </div>
            `;
            
            document.getElementById("contenido-apis").innerHTML += tarjeta;
        })
        .catch(error => {
            console.error(`Error al obtener el clima de ${nombrePais}:`, error);
            document.getElementById("contenido-apis").innerHTML += `No se pudo obtener el clima de ${nombrePais}.`;
        });
}

function mostrarApiClima() {
    ocultarPrincipal();
    createWeatherCard("Buenos Aires", -34.6131, -58.3772);
    createWeatherCard("Oslo", 59.9139, 10.7522);
    createWeatherCard("Beijing", 39.9042, 116.4074);
    createWeatherCard("Base Marambio", -64.2295, -56.6228); 
}

function mostrarApiPeliculas() {
    ocultarPrincipal();
    
    const api_key = "c2806cf8b0cc41689c126ed6733218b9";
    const api_movie = `https://api.themoviedb.org/3/movie/popular?api_key=${api_key}&language=es-ES&page=1`;

    fetch(api_movie)
        .then(response => response.json())
        .then(data => {
            const movies = data.results.slice(0, 3);
            movies.forEach(movie => {
                const title = movie.title;
                const img = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
                const overview = movie.overview;
                const tarjeta = `
                <div id="movie_card">
                    <img src="${img}" alt="Poster de ${title}" style="width: 200px; border-radius: 8px">
                    <strong>${title}</strong>
                    ${overview}
                </div>
                `;
                document.getElementById("contenido-apis").innerHTML += tarjeta;
                
            })
        })
        .catch(error => {
            console.error(`Error al obtener peliculas populares:`, error);
            document.getElementById("contenido-apis").innerHTML += `No se pudieron cargar las peliculas.`;
        });
}

function createMusicCard(artist, albun) {
    const api_music = `https://api.deezer.com/search/album?q=${encodeURIComponent(albun + " " + artist)}`
    
    // para que funcione tuve que acceder a este link: https://cors-anywhere.herokuapp.com/corsdemo
    // El problema es que la api no permite peticiones directas desde el navegador asi que usamos un proxy
    
    fetch(`https://cors-anywhere.herokuapp.com/${api_music}`)
        .then(response => response.json())
        .then(data => {
            const result = data.data[0]; 
            
            const title = result.title;
            const img = result.cover_medium;
            const artistName = result.artist.name;
            const tarjeta = `
                <div id="song_card">
                    <img src="${img}" alt="Poster de ${title}" style="width: 200px; border-radius: 8px">
                    <strong>${title}</strong>
                    <strong>${artistName}</strong>  
                </div>
            `;
            document.getElementById("contenido-apis").innerHTML += tarjeta;
        })
        .catch(error => {
            console.error(`Error al obtener el albun:`, error);
            document.getElementById("contenido-apis").innerHTML += `
            <div id="song_card">
                No se pudo cargar el albun de ${artist}.
            </div>
            `;
        });
}

let errorMostrado = false;
function mostrarApiMusica() {
    ocultarPrincipal();
    if (!errorMostrado) {
        errorMostrado = true
        document.getElementById("contenido-apis").innerHTML += `
        <div id="error">
            <strong> Atencion: </strong>
            <p> Para que esta API funcione es necesario activar un proxy temporal en: <br>
            <a href="https://cors-anywhere.herokuapp.com/corsdemo" target="_blank"> https://cors-anywhere.herokuapp.com/corsdemo </a><br>
            Una vez alli hacer clic en la opcion "Request temporary access to the demo server" y recargar la pagina. </p>
            <button onclick="continuarCargaMusica()" style="margin-top: 8px;">Ya lo activé</button>
        </div>
        `;
    } else {
        continuarCargaMusica();
    }
}

function continuarCargaMusica() {
    const error = document.getElementById("error");
    if (error) {
        error.style.display = "none";
    }
    
    createMusicCard("Nicki Nicole","Alma");
    createMusicCard("Milo j","111");
    createMusicCard("Kendrick Lamar","GNX"); 
}

showAleatoryFrase(frases, styles);


