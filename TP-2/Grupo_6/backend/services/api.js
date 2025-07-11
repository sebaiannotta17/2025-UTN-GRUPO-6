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

// Paso 1: Buscar la primera película que coincida con "matrix"
async function obtenerId() {
  const url =
    "https://api.themoviedb.org/3/search/movie?query=The%20Matrix&include_adult=false&language=en-US&page=1";

  const res = await fetch(url, options);
  const data = await res.json();

  if (!data.results || data.results.length === 0) {
    throw new Error("No se encontraron resultados para 'The Matrix'");
  }

  const peliculaID = data.results[0].id;
  console.log(`ID de la primera película encontrada: ${peliculaID}`); // para debuggear
  return peliculaID;
}

// Paso 2: Obtener los datos completos con ese ID
export async function obtenerDatosDeTheMatrix() {
  const peliculaID = await obtenerId();

  const url = `https://api.themoviedb.org/3/movie/${peliculaID}?language=en-US`;

  const res = await fetch(url, options);
  const data = await res.json();

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
  };

  console.log("Datos obtenidos:", resultado); // para debuggear
  return resultado;
}
