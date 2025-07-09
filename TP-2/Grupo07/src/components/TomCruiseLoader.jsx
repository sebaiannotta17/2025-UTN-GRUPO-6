import React from 'react';
import axios from 'axios';

const TMDB_API_KEY = '080c3c3e2ea3b52c3b430e9d22233e76';
const STRAPI_URL = "https://gestionweb.frlp.utn.edu.ar/api/g7s";
const AUTH_TOKEN = "099da4cc6cbb36bf7af8de6f1f241f8c81e49fce15709c4cfcae1313090fa2c1ac8703b0179863b4eb2739ea65ae435e90999adb870d49f9f94dcadd88999763119edca01a6b34c25be92a80ed30db1bcacb20df40e4e7f45542bd501f059201ad578c18a11e4f5cd592cb25d6c31a054409caa99f11b6d2391440e9c72611ea";

const TomCruiseLoader = () => {
  const cargarPeliculas = async () => {
    try {
      alert('Iniciando proceso de carga. Esto puede tardar...');
      const searchRes = await axios.get(`https://api.themoviedb.org/3/search/person`, {
        params: { api_key: TMDB_API_KEY, query: 'Tom Cruise' }
      });
      const actorId = searchRes.data.results[0].id;

      const creditsRes = await axios.get(`https://api.themoviedb.org/3/person/${actorId}/movie_credits`, {
        params: { api_key: TMDB_API_KEY }
      });
      const peliculasTop10 = creditsRes.data.cast
        .sort((a, b) => b.vote_count - a.vote_count)
        .slice(0, 10);

      let guardadas = 0;
      for (const pelicula of peliculasTop10) {
        // Para evitar duplicados
        const tituloCodificado = encodeURIComponent(pelicula.title);
        const checkUrl = `${STRAPI_URL}?filters[titulo][$eq]=${tituloCodificado}`;
        
        const existeRes = await axios.get(checkUrl, {
          headers: { 'Authorization': `Bearer ${AUTH_TOKEN}` }
        });

        if (existeRes.data.data.length === 0) {
          // Si no existe, la guardamos
          const detalleRes = await axios.get(`https://api.themoviedb.org/3/movie/${pelicula.id}`, {
            params: { api_key: TMDB_API_KEY }
          });
          const detalle = detalleRes.data;

          const requestData = {
            data: {
              titulo: detalle.title,
              sinopsis: detalle.overview,
              generos: detalle.genres.map(g => g.name).join(', '),
              votos: detalle.vote_count,
              promedio_votos: detalle.vote_average
            }
          };

          await axios.post(STRAPI_URL, requestData, {
            headers: {
              'Authorization': `Bearer ${AUTH_TOKEN}`,
              'Content-Type': 'application/json'
            },
          });
          console.log(`✔️ Guardada: ${detalle.title}`);
          guardadas++;
        } else {
          console.log(`Omitida (ya existe): ${pelicula.title}`);
        }
      }

      alert(`Proceso finalizado. Se guardaron ${guardadas} nuevas películas.`);
    } catch (error) {
      console.error('Error en el proceso:', error.response?.data || error.message);
      alert('Hubo un error, revisá la consola.');
    }
  };

  return (
    <button className="btn btn-white mb-3 layout-button" onClick={cargarPeliculas}>
        Cargar películas de Tom Cruise 🎬
    </button>
  );
};

export default TomCruiseLoader;