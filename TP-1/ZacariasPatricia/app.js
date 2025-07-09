const frases = [
  "Come on miracle aligner, go and get 'em tiger!",
  "All the little promises, they dont mean much when theres memories to be made.",
  "Don't forget about me, even when I doubt you, I'm not good whithout you."
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

const content = document.querySelector(".content");

const headers = {
    "X-RapidAPI-Key": "055797d2e2msh181785916fa5880p1e7c91jsn99cd3d5cbb74",
    "X-RapidAPI-Host": "spotify23.p.rapidapi.com"
};

// Función para obtener un artista aleatorio
async function getRandomArtist() {
    const randomLetter = String.fromCharCode(97 + Math.floor(Math.random() * 26)); // a-z
    const url = `https://spotify23.p.rapidapi.com/search/?q=${randomLetter}&type=artists&limit=50`;

    const response = await fetch(url, { headers });
    const data = await response.json();
    const artists = data.artists.items;

    if (artists.length > 0) {
        const randomIndex = Math.floor(Math.random() * artists.length);
        const artist = artists[randomIndex].data;
        showCard({
            title: artist.profile.name,
            image: artist.visuals.avatarImage?.sources[0]?.url || '',
            type: "Artista"
        });
    }
}

// Función para obtener un álbum aleatorio
async function getRandomAlbum() {
    const randomLetter = String.fromCharCode(97 + Math.floor(Math.random() * 26)); // a-z
    const url = `https://spotify23.p.rapidapi.com/search/?q=${randomLetter}&type=albums&limit=50`;

    const response = await fetch(url, { headers });
    const data = await response.json();
    const albums = data.albums.items;

    if (albums.length > 0) {
        const randomIndex = Math.floor(Math.random() * albums.length);
        const album = albums[randomIndex].data;
        showCard({
            title: album.name,
            image: album.coverArt?.sources[0]?.url || '',
            type: "Álbum"
        });
    }
}

// Función para mostrar una card en el contenido
function showCard({ title, image, type }) {
  const container = document.getElementById("spotify-results");
  container.innerHTML = `
      <h1>${type}</h1>
      <div class="card">
          <img src="${image}" alt="${title}">
          <p>${title}</p>
      </div>
  `;
}


// Listeners
document.querySelectorAll(".button").forEach(btn => {
    btn.addEventListener("click", (e) => {
        const text = e.target.textContent.trim().toLowerCase();
        if (text.includes("artista")) {
            getRandomArtist();
        } else if (text.includes("album")) {
            getRandomAlbum();
        }
    });
});
