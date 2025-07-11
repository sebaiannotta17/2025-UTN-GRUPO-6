import config from "../config/env.js";

// Variable para evitar ejecuciones simultáneas
let isProcessing = false;

async function getGenreMap() {
  const res = await fetch(
    `https://api.themoviedb.org/3/genre/movie/list?api_key=${config.TMDB_API_KEY}&language=${config.TMDB_LANGUAGE}`
  );
  const data = await res.json();
  const map = {};
  data.genres.forEach((g) => (map[g.id] = g.name));
  return map;
}

async function clearStrapiMovies() {
  console.log("Limpiando películas existentes en Strapi...");

  try {
    // Primero obtener todas las películas (sin límite de paginación)
    const res = await fetch(
      `${config.STRAPI_URL}?pagination[limit]=${config.STRAPI_PAGINATION_LIMIT}`,
      {
        headers: {
          Authorization: `Bearer ${config.STRAPI_API_TOKEN}`,
        },
      }
    );

    if (!res.ok) {
      console.error("Error al obtener películas para limpiar:", res.statusText);
      return;
    }

    const data = await res.json();

    if (!data || !Array.isArray(data.data)) {
      console.error("Error: respuesta inválida al obtener películas");
      return;
    }

    console.log(`Encontradas ${data.data.length} películas para eliminar`);

    // Eliminar cada película
    for (const movie of data.data) {
      try {
        const deleteRes = await fetch(
          `${config.STRAPI_URL}/${movie.documentId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${config.STRAPI_API_TOKEN}`,
            },
          }
        );

        if (deleteRes.ok) {
          console.log(`🗑️ Película eliminada: ${movie.titulo}`);
        } else {
          console.error(
            `Error al eliminar película ${movie.titulo}:`,
            await deleteRes.text()
          );
        }
      } catch (error) {
        console.error(
          `Error de red al eliminar película ${movie.titulo}:`,
          error
        );
      }
    }

    console.log("✅ Limpieza completada");

    // Pequeño delay para asegurar que Strapi procese las eliminaciones
    await new Promise((resolve) => setTimeout(resolve, 1000));
  } catch (error) {
    console.error("Error en clearStrapiMovies:", error);
  }
}

async function getExistingMovies() {
  try {
    const res = await fetch(
      `${config.STRAPI_URL}?pagination[limit]=${config.STRAPI_PAGINATION_LIMIT}`,
      {
        headers: {
          Authorization: `Bearer ${config.STRAPI_API_TOKEN}`,
        },
      }
    );

    if (!res.ok) {
      console.error("Error al obtener películas existentes:", res.statusText);
      return [];
    }

    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error("Error en getExistingMovies:", error);
    return [];
  }
}

async function fetchMultiplePages(genreMap) {
  const allMovies = [];
  const moviesSet = new Set(); // Para evitar duplicados
  const maxPages = 5;

  // Array de diferentes criterios de ordenamiento para más variedad
  const sortOptions = [
    "popularity.desc",
    "vote_average.desc",
    "vote_count.desc",
    "release_date.desc",
    "revenue.desc",
  ];

  // También buscar por géneros específicos para mayor variedad
  const popularGenres = [28, 35, 18, 53, 878, 12]; // Acción, Comedia, Drama, Thriller, Sci-Fi, Aventura

  for (let page = 1; page <= maxPages; page++) {
    try {
      // Usar diferentes criterios de ordenamiento para cada página
      const sortBy = sortOptions[(page - 1) % sortOptions.length];

      // Alternar entre búsqueda general y por género
      const isGenreSearch = page > 3;
      let url;

      if (isGenreSearch && popularGenres.length > 0) {
        const genreId = popularGenres[(page - 4) % popularGenres.length];
        url = `https://api.themoviedb.org/3/discover/movie?api_key=${config.TMDB_API_KEY}&primary_release_year=${config.MOVIE_YEAR}&sort_by=${sortBy}&language=${config.TMDB_LANGUAGE}&page=1&with_genres=${genreId}`;
      } else {
        url = `https://api.themoviedb.org/3/discover/movie?api_key=${config.TMDB_API_KEY}&primary_release_year=${config.MOVIE_YEAR}&sort_by=${sortBy}&language=${config.TMDB_LANGUAGE}&page=${page}`;
      }

      const res = await fetch(url);

      if (!res.ok) {
        console.error(`Error al obtener página ${page} de TMDB`);
        continue;
      }

      const data = await res.json();
      const movies = data.results
        .filter((movie) => movie.title && movie.overview) // Filtrar películas con datos completos
        .map((movie) => ({
          id: movie.id,
          titulo: movie.title,
          sinopsis: movie.overview,
          cantidad_votos: movie.vote_count,
          promedio_votos: movie.vote_average,
          generos: movie.genre_ids.map((id) => genreMap[id]).join(", "),
        }))
        .filter((movie) => {
          // Evitar duplicados usando el título como clave única
          const key = movie.titulo.toLowerCase();
          if (moviesSet.has(key)) {
            return false;
          }
          moviesSet.add(key);
          return true;
        });

      allMovies.push(...movies);
    } catch (error) {
      console.error(`Error al obtener página ${page}:`, error);
    }
  }

  console.log(`🔍 Películas únicas obtenidas de TMDB: ${allMovies.length}`);
  return allMovies;
}

function selectRandomMovies(movies, count) {
  // Crear una copia del array para no modificar el original
  const moviesCopy = [...movies];

  // Algoritmo Fisher-Yates para mezcla verdaderamente aleatoria
  for (let i = moviesCopy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [moviesCopy[i], moviesCopy[j]] = [moviesCopy[j], moviesCopy[i]];
  }

  return moviesCopy.slice(0, count);
}

async function maintainMovieLimit() {
  try {
    // Obtener todas las películas ordenadas por fecha de creación
    const res = await fetch(
      `${config.STRAPI_URL}?pagination[limit]=${config.STRAPI_PAGINATION_LIMIT}&sort=createdAt:asc`,
      {
        headers: {
          Authorization: `Bearer ${config.STRAPI_API_TOKEN}`,
        },
      }
    );

    if (!res.ok) {
      console.error(
        "Error al obtener películas para mantenimiento:",
        res.statusText
      );
      return;
    }

    const data = await res.json();
    const totalMovies = data.data.length;

    if (totalMovies > config.MOVIE_LIMIT) {
      const moviesToDelete = totalMovies - config.MOVIE_LIMIT;
      console.log(`🗑️ Eliminando ${moviesToDelete} películas más antiguas...`);

      // Eliminar las películas más antiguas
      for (let i = 0; i < moviesToDelete; i++) {
        const movie = data.data[i];
        try {
          const deleteRes = await fetch(
            `${config.STRAPI_URL}/${movie.documentId}`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${config.STRAPI_API_TOKEN}`,
              },
            }
          );

          if (deleteRes.ok) {
            console.log(`🗑️ Película antigua eliminada: ${movie.titulo}`);
          } else {
            console.error(`Error al eliminar película ${movie.titulo}`);
          }
        } catch (error) {
          console.error(
            `Error de red al eliminar película ${movie.titulo}:`,
            error
          );
        }
      }
    }

    console.log(
      `✅ Mantenimiento completado. Total de películas: ${Math.min(
        totalMovies,
        config.MOVIE_LIMIT
      )}`
    );
  } catch (error) {
    console.error("Error en maintainMovieLimit:", error);
  }
}

export async function fetchAndSaveMovies() {
  if (isProcessing) {
    console.log("⚠️ Ya hay un proceso en ejecución. Cancelando...");
    return;
  }

  isProcessing = true;
  console.log(`Cargando películas aleatorias de ${config.MOVIE_YEAR}...`);

  try {
    // Obtener películas existentes en Strapi
    const existingMovies = await getExistingMovies();
    console.log(`📋 Películas existentes en Strapi: ${existingMovies.length}`);

    const genreMap = await getGenreMap();

    // Obtener múltiples páginas de TMDB para tener más variedad
    const allMovies = await fetchMultiplePages(genreMap);
    console.log(`🎬 Total de películas obtenidas de TMDB: ${allMovies.length}`);

    // Filtrar películas nuevas (que no estén en Strapi)
    const existingTitles = existingMovies.map((movie) =>
      movie.titulo.toLowerCase()
    );
    const newMovies = allMovies.filter(
      (movie) => !existingTitles.includes(movie.titulo.toLowerCase())
    );

    console.log(`✨ Películas nuevas encontradas: ${newMovies.length}`);

    if (newMovies.length === 0) {
      console.log("No hay películas nuevas para agregar.");
      return;
    }

    // Seleccionar películas aleatorias de las nuevas
    const moviesToAdd = selectRandomMovies(
      newMovies,
      Math.min(newMovies.length, config.MOVIE_LIMIT)
    );
    console.log(
      `🎲 Películas seleccionadas aleatoriamente: ${moviesToAdd.length}`
    );

    // Guardar nuevas películas
    let uploadsExitosos = 0;
    for (const movieData of moviesToAdd) {
      try {
        const response = await fetch(config.STRAPI_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${config.STRAPI_API_TOKEN}`,
          },
          body: JSON.stringify({
            data: {
              titulo: movieData.titulo,
              sinopsis: movieData.sinopsis,
              generos: movieData.generos,
              cantidad_votos: movieData.cantidad_votos,
              promedio_votos: movieData.promedio_votos,
            },
          }),
        });

        if (response.ok) {
          uploadsExitosos++;
          console.log(`✅ Película guardada en Strapi: ${movieData.titulo}`);
        } else {
          console.error(
            "Error al guardar película en Strapi:",
            await response.text()
          );
        }
      } catch (error) {
        console.error("Error de red al contactar Strapi:", error);
      }
    }

    // Mantener solo 10 películas eliminando las más antiguas si es necesario
    await maintainMovieLimit();

    console.log(
      `🎯 Proceso completado: ${uploadsExitosos} películas nuevas agregadas`
    );
  } catch (error) {
    console.error("Error en fetchAndSaveMovies:", error);
    throw error;
  } finally {
    isProcessing = false;
  }
}

export async function fetchSavedMovies() {
  console.log("Cargando datos guardados...");

  try {
    const res = await fetch(
      `${config.STRAPI_URL}?pagination[limit]=${config.STRAPI_PAGINATION_LIMIT}`,
      {
        headers: {
          Authorization: `Bearer ${config.STRAPI_API_TOKEN}`,
        },
      }
    );

    if (!res.ok) {
      throw new Error(`Error al contactar a Strapi: ${res.statusText}`);
    }

    const data = await res.json();

    if (!data || !Array.isArray(data.data)) {
      throw new Error("La respuesta de Strapi no es una colección válida.");
    }

    if (data.data.length === 0) {
      console.log("No se encontraron datos en Strapi.");
      return [];
    }

    console.log(`✅ Datos obtenidos de Strapi: ${data.data.length} películas`);

    // Mostrar títulos para verificar
    console.log(
      "Títulos obtenidos:",
      data.data.map((p) => p.titulo)
    );

    return data.data.map((p) => ({
      ...p,
      generos: [{ nombre: p.generos }],
    }));
  } catch (error) {
    console.error("Error en fetchSavedMovies:", error);
    throw error;
  }
}
