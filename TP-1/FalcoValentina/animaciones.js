window.onload = function () {
    const frases = [
        { texto: "Solo, roto en mil pedazos, voy cayendo despacio, gambeteándole al mal - Perdido, Airbag", clase: "sombra1" },
        { texto: "Todas las noches, caigo en el mismo ritual: sufro de insomnio siempre que no estás acá - Noches de Insomnio, Airbag", clase: "sombra2" },
        { texto: "El miedo te trajo aquí, enterrada hasta la nariz, tu venganza no calmó a tu angustia y tu dolor - Ganas de Verte, Airbag", clase: "sombra3" }
    ];

    const fraseAleatoria = frases[Math.floor(Math.random() * frases.length)];
    const elementoFrase = document.getElementById("frase");

    elementoFrase.textContent = fraseAleatoria.texto;
    elementoFrase.classList.add(fraseAleatoria.clase);
};


// airbag.js

// Lista manual de canciones de Airbag
const cancionesAirbag = [
    "Cae el Sol",
    "Por Mil Noches",
    "Cicatrices",
    "Vivamos el Momento",
    "Apocalipsis Confort",
    "Gran Encuentro",
    "Diez Días Después",
    "Amor de Verano",
    "Mi sensación",
    "Bajos Instintos",
    "Estado Salvaje",
    "Multitud",
    "Kalashnikov",
    "La Moda del Monton",
    "Sacrificios",
    "Noches de Insomnio",
    "Fugitivo"

  ];
  
  async function obtenerFragmentoAleatorio(artista, cancion) {
    try {
      const response = await fetch(`https://api.lyrics.ovh/v1/${encodeURIComponent(artista)}/${encodeURIComponent(cancion)}`);
      const data = await response.json();
  
      if (!data.lyrics) {
        return "Letra no disponible para esta canción.";
      }
  
      const lines = data.lyrics.split('\n').filter(line => line.trim() !== '');
      if (lines.length === 0) return "No se encontraron fragmentos en la letra.";
  
      const randomLine = lines[Math.floor(Math.random() * lines.length)];
      return randomLine;
    } catch (error) {
      return "Error al obtener la letra.";
    }
  }
  
  async function mostrarFragmentoAirbag() {
    const artista = "Airbag";
    // Elegir canción al azar
    const cancion = cancionesAirbag[Math.floor(Math.random() * cancionesAirbag.length)];
    // Mostrar loading
    const contenedor = document.getElementById("api-content");
    contenedor.textContent = `Cargando fragmento de '${cancion}'...`;
  
    const fragmento = await obtenerFragmentoAleatorio(artista, cancion);
    contenedor.textContent = `"${fragmento}" - ${cancion}`;
  }
  
  document.getElementById("botonAirbag").addEventListener("click", (e) => {
    e.preventDefault();
    mostrarFragmentoAirbag();
  });
  


 document.addEventListener("DOMContentLoaded", () => {
     // Asignar eventos a los botones
     document.getElementById("botonMusica").addEventListener("click", e => {
         e.preventDefault();
         mostrarMusica();
     });
    });




function mostrarMusica() {
    const artists = [
        "Billie Eilish",
        "Airbag",
        "Tan Biónica",
        "No Te Va Gustar",
        "Harry Styles", 
        "One Direction",
        "Louis Tomlinson",
        "Olivia Rodrigo"
    ];
        const randomArtist = artists[Math.floor(Math.random() * artists.length)];
        
        const url = `https://api.deezer.com/search/artist?q=${encodeURIComponent(randomArtist)}&output=jsonp`;
        
        $('#api-content').html('<p>Cargando artista...</p>');
        
        $.ajax({
            url: url,
            dataType: 'jsonp',
            success: function(response) {
            if (response.data && response.data.length > 0) {
                    const artist = response.data[0];
        
                        // Mostrar info del artista
                    let html = `
                        <h4>Artista random: ${artist.name}</h4>
                        <img src="${artist.picture_medium}" alt="${artist.name}" />
                        <p><a href="https://www.deezer.com/artist/${artist.id}" target="_blank">Ver en Deezer</a></p>
                        <h4>Top canciones:</h4>
                        <ul id="top-tracks"></ul>
                        `;
        
                    $('#api-content').html(html);
        
                        // Ahora buscamos el top de canciones
                        const topTracksUrl = `https://api.deezer.com/artist/${artist.id}/top?limit=5&output=jsonp`;
        
                        $.ajax({
                            url: topTracksUrl,
                            dataType: 'jsonp',
                            success: function(topData) {
                                if (topData.data && topData.data.length > 0) {
                                    topData.data.forEach(track => {
                                        $('#top-tracks').append(`
                                            <li>
                                                ${track.title} 
                                                <audio controls src="${track.preview}"></audio>
                                            </li>
                                        `);
                                    });
                                } else {
                                    $('#top-tracks').html('<li>No hay canciones disponibles.</li>');
                                }
                            },
                            error: function() {
                                $('#top-tracks').html('<li>Error al cargar canciones.</li>');
                            }
                        });
        
                    } else {
                        $('#api-content').html('<p>No se encontró información del artista.</p>');
                    }
                },
                error: function() {
                    $('#api-content').html('<p>Error al cargar información de música.</p>');
                }
            });
        }
        
document.addEventListener('play', function(e) {
    const audios = document.querySelectorAll('audio');
    audios.forEach(audio => {
        if (audio !== e.target) {
            audio.pause();
            audio.currentTime = 0; 
        }
    });
}, true);
