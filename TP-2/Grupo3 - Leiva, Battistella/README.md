# TP2 - Tecnologia y gestion web 

### Carrera: Ingenieria en sistemas de informacion
### Catedra: Tecnologia y gestion web
### Grupo: 3
### Integrantes:

| Integrantes | Tarea asignada |
|---|---|
| Leiva, Emanuel | Backend en js, consumo de API de TMBd, front basico de la pagina |
|  Battistella, Tomas | Backend con strapi, Carga de strapi, visualizacion y estilos |

## Tema asignado: 

Obtener 10 series de TV que hayan sido estrenadas a partir del 2020 y guardar: Título, sinopsis, género/s, cantidad de votos, y promedio de votos

## Investigacion 

1. Exploramos la documentacion oficial de TMDb: https://developer.themoviedb.org para conocer las diferentes APIs disponibles
2. Creamos una cuenta para la API KEY
3. Relevamos las APIs necesarias para resolver el problema:
- Ver peliculas: https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&primary_release_date.gte=2020-01-01
- Ver generos: https://api.themoviedb.org/3/genre/movie/list?language=en
4. Diseñamos el frontend: incluyendo header, aside con botones para cargar y visualizar datos, main con tabla de series, y footer con créditos. 

## Tecnologias usadas: 

- Utilizamos Strapi para almacenar la informacion 
- Para el backend usamos:
    - Javascript
- Para el frontend usamos: 
    - HTML
    - CSS

## Proceso implementado
1. Consumo de la API TMDb
Se utilizó la función setMovies() que:

- Llama a las APIs de películas y géneros listadas arriba.
- Devuelve un array de 10 objetos con estructura:
```js
{
  nombre: p.title,
  sinopsis: p.overview,
  generos: [array de strings],
  cantidadDeVotos: p.vote_count,
  promedioDeVotos: p.vote_average
}

```

2. Carga en Strapi
Se creó un Content Type G3_Serie con campos:
- titulo (Text)
- sinopsis (Text)
- genero (Text)
- cant_votos (Integer)
- prom_votos (Decimal)
Se desarrolló la función:
```js
async function subirSeriesStrapi() {
  const series = await setMovies();
  for (const serie of series) {
    await guardarSerieEnStrapi(serie);
  }
  console.log("Series cargadas correctamente en Strapi");
}
```

3. Visualizacion
- obtenerSeriesStrapi(): consulta hasta 100 series guardadas.
- crearTablaSeries(): arma la tabla HTML.
- mostrarSeries(): oculta secciones previas y renderiza la tabla.

## Frontend y estilos
- Header con título y logo.
- Aside con botones para:
    - Cargar series.
    - Ver series.
    - Borrar series.
- Main que contiene la tabla.
- Footer con créditos.

Problemas resueltos:
- Tabla oculta por header: se corrigió con padding-top.
- Scroll interno con overflow-y: auto.
- Botones alineados eliminando line-height fijo.

## Conclusión
Se integraron:
- Consumo de APIs externas.
- Almacenamiento con CMS headless.
- Visualización dinámica en frontend.
Consolidando así conceptos de frontend, backend y gestión de datos.