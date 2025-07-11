import React, { useState, useEffect } from 'react';

const TMDB_API_KEY = '5e393a2965ef1b88e2dd5d6ea8bf1301';
const STRAPI_API_URL = 'https://gestionweb.frlp.utn.edu.ar/api/actor-popular-pelicula-grupo10s';
const STRAPI_API_TOKEN = '099da4cc6cbb36bf7af8de6f1f241f8c81e49fce15709c4cfcae1313090fa2c1ac8703b0179863b4eb2739ea65ae435e90999adb870d49f9f94dcadd88999763119edca01a6b34c25be92a80ed30db1bcacb20df40e4e7f45542bd501f059201ad578c18a11e4f5cd592cb25d6c31a054409caa99f11b6d2391440e9c72611ea';

export default function App() {
    const [popularActors, setPopularActors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const commonHeaders = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${STRAPI_API_TOKEN}`
    };

    const fetchGenres = async () => {
        const response = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${TMDB_API_KEY}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch genres: ${response.statusText}`);
        }
        const data = await response.json();
        return data.genres;
    };

    // fetch TheMovieDB
    const fetchAndStoreData = async () => {
        setLoading(true);
        setError(null);
        try {
            const genresList = await fetchGenres();

            const popularPeopleResponse = await fetch(`https://api.themoviedb.org/3/person/popular?api_key=${TMDB_API_KEY}`);
            if (!popularPeopleResponse.ok) {
                throw new Error(`Failed to fetch popular people: ${popularPeopleResponse.statusText}`);
            }
            const popularPeopleData = await popularPeopleResponse.json();
            const top10Actors = popularPeopleData.results.slice(0, 10);

            const formattedData = [];

            for (const actor of top10Actors) {
                const movieCreditsResponse = await fetch(`https://api.themoviedb.org/3/person/${actor.id}/movie_credits?api_key=${TMDB_API_KEY}`);
                if (!movieCreditsResponse.ok) {
                    throw new Error(`Failed to fetch movie credits for ${actor.name}: ${movieCreditsResponse.statusText}`);
                }
                const movieCreditsData = await movieCreditsResponse.json();

                const movies = movieCreditsData.crew ? movieCreditsData.crew.filter(credit => credit.media_type === 'movie' && credit.release_date) : [];
                const castMovies = movieCreditsData.cast ? movieCreditsData.cast.filter(credit => credit.media_type === 'movie' && credit.release_date) : [];

                const allMovies = [...movies, ...castMovies];

                // pelicula más reciente
                allMovies.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));

                // pelicula más reciente ya estrenada
                let latestMovie = null;
                for(const movie of allMovies){
                    if (movie.release_date && new Date(movie.release_date) <= new Date()) {
                        latestMovie = movie;
                        break;
                    }
                }

                // si no hay pelicula estrenada, se busca la más reciente aunque sea futura
                if (!latestMovie && allMovies.length > 0) {
                    latestMovie = allMovies[0];
                    console.warn(`No hay películas estrenadas para ${actor.name}. Se toma la más reciente aunque sea futura: ${latestMovie.title}`);
                }

                if (latestMovie) {
                    const movieDetailsResponse = await fetch(`https://api.themoviedb.org/3/movie/${latestMovie.id}?api_key=${TMDB_API_KEY}`);
                    if (!movieDetailsResponse.ok) {
                        console.warn(`Could not fetch details for movie ${latestMovie.id}. Skipping.`);
                        continue;
                    }
                    const movieDetails = await movieDetailsResponse.json();

                    const genreNames = movieDetails.genres.map(genre => {
                        const matchedGenre = genresList.find(g => g.id === genre.id);
                        return matchedGenre ? matchedGenre.name : 'Desconocido';
                    });

                    const nameParts = actor.name.split(' ');
                    const firstName = nameParts[0];
                    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

                    formattedData.push({
                        Nombre: firstName,
                        Apellido: lastName,
                        Pelicula: movieDetails.title,
                        Estreno: movieDetails.release_date,
                        CantVotos: movieDetails.vote_count,
                        PromVotos: movieDetails.vote_average,
                        Generos: genreNames,
                    });
                } else {
                    if (allMovies.length === 0) {
                        // console.warn(`No se encontraron películas para ${actor.name}.`);
                    } else {
                        console.warn(`No valid latest movie found for ${actor.name}. Skipping. Películas encontradas:`, allMovies.map(m => m.title));
                    }
                }
            }

            // eliminar repetidos
            const uniqueData = [];
            const seen = new Set();
            for (const data of formattedData) {
                const key = `${data.Nombre.toLowerCase()}|${data.Apellido.toLowerCase()}`;
                if (!seen.has(key)) {
                    seen.add(key);
                    uniqueData.push(data);
                }
            }

            const top10ByPromVotos = uniqueData
                .sort((a, b) => b.PromVotos - a.PromVotos)
                .slice(0, 10);

            setPopularActors(
                top10ByPromVotos.map((data, idx) => ({
                    id: idx,
                    attributes: data
                }))
            );

            const existingDataResponse = await fetch(STRAPI_API_URL, { headers: commonHeaders });
            if(existingDataResponse.ok) {
                const existingData = await existingDataResponse.json();
                for (const item of existingData.data) {
                    await fetch(`${STRAPI_API_URL}/${item.id}`, {
                        method: 'DELETE',
                        headers: commonHeaders,
                    });
                }
                console.log("Existing data cleared from Strapi.");
            }

            for (const data of top10ByPromVotos) {
                const response = await fetch(STRAPI_API_URL, {
                    method: 'POST',
                    headers: commonHeaders,
                    body: JSON.stringify({ data: data }),
                });
                if (!response.ok) {
                    throw new Error(`Failed to store data: ${response.statusText}`);
                }
            }
            setTimeout(() => {
                alert('Datos obtenidos de TheMovieDB y guardados exitosamente en Strapi!');
                fetchStoredData();
            }, 500);
        } catch (err) {
            console.error("Error al obtener o guardar datos:", err);
            setError("Error al obtener o guardar datos: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    // fetch Strapi
    const fetchStoredData = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(STRAPI_API_URL, { headers: commonHeaders });
            if (!response.ok) {
                throw new Error(`Failed to fetch data from Strapi: ${response.statusText}`);
            }
            const responseData = await response.json();
            setPopularActors(responseData.data);
        } catch (err) {
            console.error("Error fetching data from Strapi:", err);
            setError("Error fetching data from Strapi: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // fetchStoredData();
    }, []);


    return (
        <div>
            <header>
                <h1>TP Nro 2 - Grupo 10</h1>
            </header>
            <nav className="link-api">
                <ol>
                    <li>
                        <button onClick={fetchAndStoreData} disabled={loading}>
                            {loading ? "Procesando..." : "Obtener y Guardar Datos"}
                        </button>
                    </li>
                    <li>
                        <button onClick={fetchStoredData} disabled={loading}>
                            Actualizar Visualización
                        </button>
                    </li>
                </ol>
            </nav>
            <main>
                <div id="output">
                    {loading && <p>Cargando información...</p>}
                    {error && <p style={{ color: 'red' }}>Error: {error}</p>}
                    {!loading && !error && popularActors.length === 0 && (
                        <p>No hay información disponible. Haz clic en "Obtener y Guardar Datos" para cargarla.</p>
                    )}
                    {!loading && !error && popularActors.length > 0 && (
                        <div>
                            <h2>Actores/Actrices Populares y sus Últimas Películas</h2>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                                {popularActors
                                    .slice(0, 10)
                                    .map((item) => (
                                        item && item.Nombre ? (
                                            <div key={item.id} style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
                                                <h3>{item.Nombre} {item.Apellido}</h3>
                                                <p><strong>Película:</strong> {item.Pelicula}</p>
                                                <p><strong>Fecha de Estreno:</strong> {item.Estreno}</p>
                                                <p><strong>Cantidad de Votos:</strong> {item.CantVotos}</p>
                                                <p><strong>Promedio de Votos:</strong> {item.PromVotos}</p>
                                                <p><strong>Géneros:</strong> {Array.isArray(item.Generos) ? item.Generos.join(', ') : item.Generos}</p>
                                            </div>
                                        ) : null
                                    ))}
                            </div>
                        </div>
                    )}
                </div>
            </main>
            <footer>
                <p>TyGWeb - 2025</p>
            </footer>
        </div>
    );
}