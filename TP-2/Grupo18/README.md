# Tecnologia y Gestión Web

## Trabajo Practico N°2

Este proyecto consiste en el desarrollo de un sitio web en donde consumimos la información de la API, la almacenamos en Strapi y luego la visualizamos

### Grupo 18

**Integrantes:**
- Garcia Ignacio
- Sagasti Emilio

### Investigación del sitio

En este punto, busque en el sitio TMBD, la serie "The Big Bang Theory", y anote el id el cual se encontraba en la URL, en este caso era 1418

En la documentación de TMDB, en la seccion de "TV Seasons", en el apartado "Details", emplee el id de serie y el id de temporada (3), y luego inspecciono la estructura de JSON para anotar los campos requeridos (nombre de empisodio, fecha de emisión, sinopsis, duración, cantidad de votos y promedio de votos)

### Creación de cuenta y autenticación en el sitio

Me registré en TMDB y validé mi correo para activar la cuenta.  
Accedí a “Settings → API” y copié la API Key
Probé tanto la url como la API Key en Postman para asegurarme de que las llamadas autenticadas devolvieran resultados sin errores.

### Relevamiento de las APIs necesarias

Defini las siguientes rutas para cubrir la problematica:

- `../3/tv/1418/season/3` Para listar todos los episodios de la serie en una determinada temporada
- `../3/tv/1418/season/3/episode/{episode_number}` Para listar los detalles de los episodios

Estas rutas tendran ademas `language=es-AR` agregado para dar los resultados en español

### Tecnologias utilizadas

- HTML5
- CSS3
- JavaScript
- Bootstrap 5
- Chart.js

### APIs utilizadas

- [The Movie DB](https://api.themoviedb.org)
- [Strapi](https://gestionweb.frlp.utn.edu.ar)