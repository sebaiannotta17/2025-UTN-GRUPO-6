const STRAPI_URL = "https://gestionweb.frlp.utn.edu.ar";
const jwtToken = "099da4cc6cbb36bf7af8de6f1f241f8c81e49fce15709c4cfcae1313090fa2c1ac8703b0179863b4eb2739ea65ae435e90999adb870d49f9f94dcadd88999763119edca01a6b34c25be92a80ed30db1bcacb20df40e4e7f45542bd501f059201ad578c18a11e4f5cd592cb25d6c31a054409caa99f11b6d2391440e9c72611ea";

async function crearGeneroSiNoExiste(nombreGenero) {
  const res = await fetch(
    `${STRAPI_URL}/api/grupo-5-generos?filters[nombre][$eq]=${encodeURIComponent(nombreGenero)}`,
    {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
  );

  const data = await res.json();
  if (data.data && data.data.length > 0) {
    return data.data[0].id;
  }

  const crearRes = await fetch(`${STRAPI_URL}/api/grupo-5-generos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwtToken}`,
    },
    body: JSON.stringify({
      data: {
        nombre: nombreGenero,
      },
    }),
  });

  const crearData = await crearRes.json();
  return crearData.data.id;
}

async function crearSerieSiNoExiste(serie) {
  const res = await fetch(
    `${STRAPI_URL}/api/grupo-5-series?filters[titulo][$eq]=${encodeURIComponent(serie.title)}`,
    {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
  );

  const data = await res.json();
  if (data.data && data.data.length > 0) {
    return;
  }

  const idsGeneros = [];
  for (const genero of serie.generos) {
    const id = await crearGeneroSiNoExiste(genero);
    idsGeneros.push(id);
  }

  await fetch(`${STRAPI_URL}/api/grupo-5-series`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwtToken}`,
    },
    body: JSON.stringify({
      data: {
        titulo: serie.title,
        sinopsis: serie.synopsis,
        paisOrigen: Array.isArray(serie.pais_origen)
          ? serie.pais_origen.join(", ")
          : serie.pais_origen,
        popularidad: serie.popularidad,
        grupo_5_generos: idsGeneros,
      },
    }),
  });
}

async function guardarSeriesEnStrapi(series) {
  for (const serie of series) {
    await crearSerieSiNoExiste(serie);
  }
}