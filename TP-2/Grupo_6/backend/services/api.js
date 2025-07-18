import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const API_TOKEN = process.env.API_TOKEN;

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_TOKEN}`,
  },
};

async function obtenerId() {
  const url =
    "https://api.themoviedb.org/3/search/movie?query=The%20Matrix&include_adult=false&language=es-ES&page=1";

  const res = await fetch(url, options);
  const data = await res.json();

  if (!data.results || data.results.length === 0) {
    throw new Error("No se encontraron resultados para 'The Matrix'");
  }

  const peliculaID = data.results[0].id;
  console.log(`ID de la primera película encontrada: ${peliculaID}`);
  return peliculaID;
}

async function recuperarActores(idPelicula) {
  const url = `https://api.themoviedb.org/3/movie/${idPelicula}/credits?language=es-ES`;
  const res = await fetch(url, options);
  const data = await res.json();

  const primerosActores = data.cast.slice(0, 10); 
  const actores = await Promise.all(
    primerosActores.map((actor) => detalleActor(actor.id))
  );
  return actores;
}

async function detalleActor(idActor) {
  const url = `https://api.themoviedb.org/3/person/${idActor}?language=es-ES`;
  const res = await fetch(url, options);
  const data = await res.json();

  // Extraer país desde place_of_birth
  let pais = "Desconocido";
  if (data.place_of_birth) {
    const partes = data.place_of_birth.split(",");
    pais = partes[partes.length - 1].trim();
  }

  return {
    nombre: data.name,
    pais_origen: pais,
  };
}

export async function obtenerDatosDeTheMatrix() {
  const peliculaID = await obtenerId();

  const url = `https://api.themoviedb.org/3/movie/${peliculaID}?language=es-ES`;
  const res = await fetch(url, options);
  const data = await res.json();

  const actores = await recuperarActores(peliculaID);

  const resultado = {
    nombre: data.title,
    generos: data.genres?.map((g) => g.name) || [],
    pagina_web: data.homepage || "",
    companias: Array.isArray(data.production_companies)
      ? data.production_companies.map((c) => ({
          nombre: c.name,
          logo: c.logo_path,
        }))
      : [],
    estreno: data.release_date,
    recaudacion: data.revenue,
    actores: actores,
  };

  console.log("Datos obtenidos:", resultado);
  return resultado;
}
