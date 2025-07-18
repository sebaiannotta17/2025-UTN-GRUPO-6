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
  const logoUrl = entidad.logo ? entidad.logo : null;
  // 1) Buscar entidad existente por nombre
  const busqRes = await strapiFetch(
    `/api/${tipo}?filters[nombre][$eq]=${encodeURIComponent(nombre)}`
  );
  const busqJson = await busqRes.json();
  console.log("entidad encontrado: ", busqJson)
  if (Array.isArray(busqJson.data) && busqJson.data.length) {
    const entidadExistente = busqJson.data[0];
    console.log(`Entidad '${nombre}' de tipo '${tipo}' ya existe con ID: ${entidadExistente.id}`);

    // Si la entidad existe Y se proporciona un logo, y el logo_url actual es diferente, actualizar.
    if (logoUrl && entidadExistente.logo !== logoUrl) {
        console.log(`Actualizando logo_url para '${nombre}' de '${entidadExistente.logo}' a '${logoUrl}'`);
        const updateRes = await strapiFetch(`/api/${tipo}/${entidadExistente.id}`, {
            method: "PUT",
            body: JSON.stringify({ data: { logo: logoUrl } }),
        });
        await updateRes.json();
        console.log(`Logo_url actualizado para ${nombre}.`);
    }
    return entidadExistente.id;
  }

  // 2) Si no existe, crear la entidad
  console.log(`Creando nueva entidad '${nombre}' de tipo '${tipo}'.`);
  const dataToCreate = { nombre };
  if (logoUrl) {
    dataToCreate.logo = logoUrl;
  }

  const crearRes = await strapiFetch(`/api/${tipo}`, {
    method: "POST",
    body: JSON.stringify({ data: dataToCreate }),
  });
  const crearJson = await crearRes.json();
  console.log(`Entidad '${nombre}' creada con ID: ${crearJson.data.id}`);
  return crearJson.data.id;
}


// Busca o crea un actor
async function obtenerOCrearActor(actor) {
  const { nombre, pais_origen } = actor;

  const res = await strapiFetch(
    `/api/g6-actors?filters[nombre][$eq]=${encodeURIComponent(nombre)}`
  );
  const json = await res.json();
  console.log("actor encontrado: ", json)

  if (Array.isArray(json.data) && json.data.length) {
    const existente = json.data[0];
    console.log(`Actor '${nombre}' ya existe con ID: ${existente.id}`);
    return existente.id;
  }

  console.log(`Creando actor: ${nombre}`);
  const crearRes = await strapiFetch("/api/g6-actors", {
    method: "POST",
    body: JSON.stringify({
      data: {
        nombre: nombre,
        nacionalidad: pais_origen,
      },
    }),
  });

  const crearJson = await crearRes.json();
  console.log(`Actor '${nombre}' creado con ID: ${crearJson.data.id}`);
  return crearJson.data.id;
}




// Crea la película en Strapi (si no existe)
async function crearPelicula(datos) {
 //1) ¿Ya existe?
  const pelisRes = await strapiFetch(
    `/api/g6-peliculas?filters[nombre][$eq]=${encodeURIComponent(datos.nombre)}`
  );
  
  console.log("hola:", pelisJson.data)
  if (Array.isArray(pelisJson.data) && pelisJson.data.length) {
    console.log("Película ya existe:", pelisJson.data[0]);
    return pelisJson.data[0];
  }

  // 2) Crear géneros, compañías y actores
  const generoIds = await Promise.all(
    datos.generos.map((g) => obtenerOCrearEntidad(g, "g6-generos"))
  );
  const companiaIds = await Promise.all(
    datos.companias.map((c) => obtenerOCrearEntidad(c, "g6-companias"))
  );
  const actorIds = await Promise.all(
    datos.actores.map((a) => obtenerOCrearActor(a))
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
        g_6_actors: actorIds,
      },
    }),
  });

  const crearJson = await crearRes.json();
  console.log("Película creada:", crearJson);
  return crearJson.data;
}
export async function eliminarTodo() {
  try {
    const res = await strapiFetch("/api/g6-peliculas?populate=*");
    const json = await res.json();
    const peliculas = json.data;
    
    for (const pelicula of peliculas) {
      const { g6_actors, g6_generos, g6_companias } = pelicula;

      if (g6_actors) {
        for (const actor of g6_actors) {
          await strapiFetch(`/api/g6-actors/${actor.id}`, { method: "DELETE" });
          console.log(`Actor con ID: ${actor.id} eliminado.`);
        }
      }

      if (g6_generos) {
        for (const genero of g6_generos) {
          await strapiFetch(`/api/g6-generos/${genero.id}`, { method: "DELETE" });
          console.log(`Género con ID: ${genero.id} eliminado.`);
        }
      }

      if (g6_companias) {
        for (const compania of g6_companias) {
          await strapiFetch(`/api/g6-companias/${compania.id}`, { method: "DELETE" });
          console.log(`Compañía con ID: ${compania.id} eliminada.`);
        }
      }

      await strapiFetch(`/api/g6-peliculas/${pelicula.id}`, { method: "DELETE" });
      console.log(`Película con ID: ${pelicula.id} eliminada.`);
    }

    console.log("Todas las películas y sus entidades relacionadas han sido eliminadas.");

  } catch (error) {
    console.error("Hubo un error al eliminar los datos:", error);
  }
}

// Controlador para cargar Matrix
export async function cargarPelicula() {
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
