const STRAPI_TOKEN = process.env.REACT_APP_STRAPI_API_TOKEN;
const TMDB_KEY = process.env.REACT_APP_TMDB_API_KEY;
const url_api = `https://gestionweb.frlp.utn.edu.ar/api/G25-Trailers`;

export const fetchTrailersFromTMDB = async (movieId) => {
    const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_KEY}&append_to_response=videos`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Error al buscar en TMDB');

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
    if (!response.ok) throw new Error('Error al guardar en Strapi');
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