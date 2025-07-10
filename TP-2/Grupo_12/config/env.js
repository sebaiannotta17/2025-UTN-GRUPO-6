// Configuración de variables de entorno
// En un entorno de producción, estas variables deberían cargarse desde variables de entorno del servidor
const config = {
  TMDB_API_KEY: "2a4f5321b90d10933e42d2cf28d74840",
  STRAPI_URL: "https://gestionweb.frlp.utn.edu.ar/api/g12-peliculas",
  STRAPI_API_TOKEN:
    "099da4cc6cbb36bf7af8de6f1f241f8c81e49fce15709c4cfcae1313090fa2c1ac8703b0179863b4eb2739ea65ae435e90999adb870d49f9f94dcadd88999763119edca01a6b34c25be92a80ed30db1bcacb20df40e4e7f45542bd501f059201ad578c18a11e4f5cd592cb25d6c31a054409caa99f11b6d2391440e9c72611ea",
  TMDB_LANGUAGE: "es-AR",
  MOVIE_YEAR: 1999,
  MOVIE_LIMIT: 10,
  STRAPI_PAGINATION_LIMIT: 100,
};

export default config;
