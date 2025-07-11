function getNameGenres(data) {
  const mapa = {};
  data.genres.forEach((genre) => {
    mapa[genre.id] = genre.name;
  });
  return mapa;
}

async function obtenerSeriesMasViejas() {
  try {
    const apiKey = "bd3f41a01696d2f52966baa70389edee";

    const responseGenre = await fetch(
      `https://api.themoviedb.org/3/genre/tv/list?language=es-ES&api_key=${apiKey}`
    );
    if (!responseGenre.ok) {
      throw new Error("Error al obtener géneros");
    }
    const dataGenres = await responseGenre.json();
    const genreNames = getNameGenres(dataGenres);

    const url = `https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&sort_by=first_air_date.asc&language=es-ES&page=1`;
    const response = await fetch(url, {
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiZDNmNDFhMDE2OTZkMmY1Mjk2NmJhYTcwMzg5ZWRlZSIsIm5iZiI6MTc1MTkyOTA5Ny42Nywic3ViIjoiNjg2YzUxMDk0YTRiNDRhMGRhYTk2MDQzIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.b4haPkvAzuFAVVWbybfWqPU3AsOheHXXih6N5C0Y4BI",
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener series");
    }

    const data = await response.json();
    const series = data.results.slice(0, 9);

    const seriesResults = series.map((serie) => ({
      title: serie.name,
      synopsis: serie.overview ? serie.overview : "Sinopsis no disponible",
      generos:
        serie.genre_ids.length > 0
          ? serie.genre_ids.map((id) => genreNames[id] || "Desconocido")
          : ["No especificado"],
      popularidad: serie.popularity,
      pais_origen: serie.origin_country,
    }));

    return seriesResults;
  } catch (error) {
    console.error("Error al obtener series:", error);
    alert("Error al obtener datos de la API");
    throw error;
  }
}

async function cargarSeriesEnStrapi() {
  try {
    const series = await obtenerSeriesMasViejas();
    await guardarSeriesEnStrapi(series);
    alert("Series cargadas exitosamente en Strapi");
  } catch (error) {
    alert("Error durante la carga a Strapi");
  }
}