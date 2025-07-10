# Trabajo Práctico 2 - Grupo 4

## INTEGRANTES <br>
Piazza Damian - Legajo 33400 <br>
Bucchino Ulises - Legajo 33326 <br>
Piquet Leonel - Legajo 33725 <br>
Garcia Amendola Martina - Legajo 33093 <br>
Domato Tobias - Legajo 33271 <br>

## TAREAS REALIZADAS <br>

### INVESTIGACIÓN DEL SITIO https://developer.themoviedb.org <br>
INTEGRANTES: Domato Tobias y Garcia Amendola Martina. <br>
DESCRIPCIÓN: exploración de la plataforma oficial de TheMovieDB, entendiendo cómo funciona su API, qué recursos están disponibles (películas, géneros, actores, etc), cómo se estructuran los endpoints, y qué parámetros se pueden utilizar. <br>

### CREACIÓN DE CUENTA Y AUTENTICACIÓN EN EL SITIO <br>
INTEGRANTE: Piquet Leonel. <br>
DESCRIPCIÓN: registro en TMDB para obtener una clave de acceso (api_key). Esta clave es necesaria para realizar peticiones a la API. <br>

### RELEVAMIENTO DE APIs NECESARIAS <br>
INTEGRANTE: Piazza Damian. <br>
DESCRIPCIÓN: identificación de endpoints a utilizar para cumplir con la consigna del TP:
- /discover/movie para obtener las películas más votadas de Argentina.
- /genre/movie/list para conocer el nombre de cada género según su id.
También incluye la definición de parámetros: region=AR, vote_count.gte=1000, sort_by=vote_count.desc, language=es-AR. <br>

### BOSQUEJO DEL FRONTEND <br>
INTEGRANTE: Bucchino Ulises. <br>
DESCRIPCIÓN: diseño de una estructura básica de la interfaz de usuario que contendrá:
- Un botón para cargar los datos desde la API.
- Un botón para visualizar las películas en pantalla.
- Una zona principal donde se mostrarán los resultados.
- Uso de HTML, CSS y JavaScript con Axios para conectar datos y mostrarlos dinámicamente.