import fetch from "node-fetch";
import { obtenerDatosDeTheMatrix } from "./api.js";
import dotenv from 'dotenv';
dotenv.config();

const STRAPI_URL = process.env.STRAPI_URL;
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN; 

// Helper genérico que siempre agrega el token a la peticion a la api de strapi
async function strapiFetch(path, opts = {}) {
  const res = await fetch(`${STRAPI_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${STRAPI_API_TOKEN}`,
    },
    ...opts,
  });
  return res;
}

// Busca o crea una entidad (género o compañía)
async function obtenerOCrearEntidad(entidad, tipo) {
  const nombre = typeof entidad === "string" ? entidad : entidad.nombre;

  // 1) Buscar
  const busqRes = await strapiFetch(
    `/api/${tipo}?filters[nombre][$eq]=${encodeURIComponent(nombre)}`
  );
  const busqJson = await busqRes.json();

  if (Array.isArray(busqJson.data) && busqJson.data.length) {
    return busqJson.data[0].id;
  }

  // 2) Crear
  const data = { nombre };
  if (typeof entidad === "object" && entidad.logo) {
    data.logo = entidad.logo;
  }

  const crearRes = await strapiFetch(`/api/${tipo}`, {
    method: "POST",
    body: JSON.stringify({ data }),
  });
  const crearJson = await crearRes.json();
  return crearJson.data.id;
}


// Crea la película en Strapi (si no existe)
async function crearPelicula(datos) {
  // 1) ¿Ya existe?
  const pelisRes = await strapiFetch(
    `/api/g6-peliculas?filters[nombre][$eq]=${encodeURIComponent(datos.nombre)}`
  );
  const pelisJson = await pelisRes.json();
  if (Array.isArray(pelisJson.data) && pelisJson.data.length) {
    console.log("Película ya existe:", pelisJson.data[0]);
    return pelisJson.data[0];
  }

  // 2) Crear géneros y compañías
  const generoIds = await Promise.all(
    datos.generos.map((g) => obtenerOCrearEntidad(g, "g6-generos"))
  );
  const companiaIds = await Promise.all(
    datos.companias.map((c) => obtenerOCrearEntidad(c, "g6-companias"))
  );

  // 3) Crear película
  const crearRes = await strapiFetch(`/api/g6-peliculas`, {
    method: "POST",
    body: JSON.stringify({
      data: {
        nombre: datos.nombre,
        pagina_web: datos.pagina_web,
        estreno: datos.estreno,
        recaudacion: datos.recaudacion,
        g_6_generos: generoIds,
        g_6_companias: companiaIds,
      },
    }),
  });
  const crearJson = await crearRes.json();
  console.log("Película creada:", crearJson);
  return crearJson.data;
}

// Controlador para cargar Matrix
export async function cargarPelicula() {
  await limpiarStrapi()
  const datos = await obtenerDatosDeTheMatrix();
  const pelicula = await crearPelicula(datos);
  return pelicula;
}

// Controlador para recuperar películas
export async function recuperarPeliculas() {
  const res = await strapiFetch("/api/g6-peliculas?populate=*");
  const json = await res.json();
  return json;
}
