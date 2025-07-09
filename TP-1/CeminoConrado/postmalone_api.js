// ID de artista en MusicBrainz
async function obtenerIdArtista(nombre) {
    const res = await fetch(`https://musicbrainz.org/ws/2/artist/?query=${encodeURIComponent(nombre)}&fmt=json`);
    const data = await res.json();
    return data.artists[0].id;
}

// obtener albumes y elegir uno al azar
async function obtenerAlbumAleatorio(artistId) {
    const res = await fetch(`https://musicbrainz.org/ws/2/release-group?artist=${artistId}&type=album&fmt=json`);
    const data = await res.json();
    const albums = data['release-groups'];
    return albums[Math.floor(Math.random() * albums.length)];
}

// canciones del album
async function obtenerCancionesDelAlbum(albumId) {
    const res = await fetch(`https://musicbrainz.org/ws/2/release?release-group=${albumId}&fmt=json`);
    const data = await res.json();
    if (!data.releases.length) return [];
    
    const releaseId = data.releases[0].id;
    const res2 = await fetch(`https://musicbrainz.org/ws/2/recording?release=${releaseId}&fmt=json`);
    const data2 = await res2.json();
    
    const canciones = data2.recordings;
    const seleccionadas = canciones.sort(() => 0.5 - Math.random()).slice(0, 3);
    return seleccionadas.map(c => c.title);
}

// portada del album
async function obtenerPortadaAlbum(releaseId) {
    try {
        const res = await fetch(`https://coverartarchive.org/release/${releaseId}`);
        const data = await res.json();
        return data.images[0].image;
    } catch (error) {
        console.warn("No se encontro portada para este album.");
        return '';
    }
}

// insertar en el html
async function mostrarInformacion() {
    try {
        const artistId = await obtenerIdArtista("Post Malone");
        const album = await obtenerAlbumAleatorio(artistId);
        const canciones = await obtenerCancionesDelAlbum(album.id);
        
        const res = await fetch(`https://musicbrainz.org/ws/2/release?release-group=${album.id}&fmt=json`);
        const data = await res.json();
        const releaseId = data.releases[0].id;
        const portada = await obtenerPortadaAlbum(releaseId);

        document.getElementById("imagen").innerHTML = portada
            ? `<img src="${portada}" alt="Portada del album">`
            : `<p>Portada no disponible.</p>`;

        document.getElementById("album").innerHTML = `<h2>${album.title}</h2>`;

        document.getElementById("canciones-album").innerHTML = `
            ${canciones.map(c => `<div>${c}</div>`).join('')}
        `;
    } catch (err) {
        console.error("Error obteniendo datos:", err);
        document.getElementById("album").textContent = "Error al cargar los datos.";
    }
}

mostrarInformacion();