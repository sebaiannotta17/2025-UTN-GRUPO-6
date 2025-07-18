const STRAPI_TOKEN = '099da4cc6cbb36bf7af8de6f1f241f8c81e49fce15709c4cfcae1313090fa2c1ac8703b0179863b4eb2739ea65ae435e90999adb870d49f9f94dcadd88999763119edca01a6b34c25be92a80ed30db1bcacb20df40e4e7f45542bd501f059201ad578c18a11e4f5cd592cb25d6c31a054409caa99f11b6d2391440e9c72611ea';
const TMDB_KEY = '7a0da2a763bb92d8230a59dab03bd601';
const url_api = 'https://gestionweb.frlp.utn.edu.ar/api/g25-trailers';

export const fetchTrailersFromTMDB = async (movieId) => {
    const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_KEY}&append_to_response=videos`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Error al buscar en TMDB. Revisa la consola.');

    const data = await response.json();
    const movieTitle = data.title;
    const trailers = data.videos.results.filter(v => v.site === 'YouTube' && v.type === 'Trailer');

    return { movieTitle, trailers };
};

export const saveTrailerToStrapi = async (movieId, movieTitle, trailer) => {
    const payload = {
        data: {
            id_pelicula: movieId,
            titulo_pelicula: movieTitle,
            nombre_trailer: trailer.name,
            youtube_key: trailer.key,
        },
    };

    const response = await fetch(url_api, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${STRAPI_TOKEN}`,
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error("Respuesta de error del servidor:", errorText);
        throw new Error(`Error ${response.status} (${response.statusText}). Revisa la consola para ver la respuesta completa del servidor.`);
    }
    return await response.json();
};

export const fetchTrailersFromStrapi = async () => {
    const response = await fetch(url_api, {
        headers: {
            'Authorization': `Bearer ${STRAPI_TOKEN}`,
        },
    });
    if (!response.ok) throw new Error('Error al obtener datos de Strapi');
    const result = await response.json();
    return result.data;
};