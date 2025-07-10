# Trabajo Grupal - Tecnologia y Gestión Web

## Trabajo Práctico N°2

Este proyecto consiste en el desarrollo de un sitio web en donde consumimos la información de la API, la almacenamos en Strapi y luego la visualizamos.

### Grupo 18

**Integrantes:**
- Joaquin Montes
- Maximo Carpignano
- Ulises Moran
- Pedro Fiuza
- Jesus Vergara

---

### ¿Qué tenemos que hacer?
Se nos pidió obtener los 10 géneros de películas más populares por número de películas asociadas. Para ello, debemos listar los 10 géneros con la mayor cantidad de películas disponibles en la API, mostrando el nombre del género y el conteo de películas.

---

### Pasos del Proyecto 📝

1.  [cite_start]**Generación de Información**: Obtendremos los datos necesarios desde la API de The Movie DB[cite: 17, 28].
2.  [cite_start]**Almacenamiento**: Utilizaremos un botón en nuestra interfaz que, al ser presionado, tomará la información de la API y la guardará en nuestro CMS, Strapi[cite: 30, 32]. [cite_start]La instancia de Strapi provista por la cátedra se encuentra en `https://gestionweb.frlp.utn.edu.ar/admin/`[cite: 26].
3.  [cite_start]**Búsqueda y Visualización**: Una vez almacenados, accederemos a los datos a través de la API de Strapi[cite: 34]. [cite_start]Finalmente, presentaremos esta información en el frontend mediante gráficos o tablas para una clara visualización[cite: 35].

---

### Creación de cuenta y autenticación en el sitio

[cite_start]Para comenzar, me registré en **[The Movie DB](https://developer.themoviedb.org)** y validé mi correo electrónico para activar la cuenta[cite: 46]. [cite_start]Luego, accedí a la sección "Settings → API" para generar y copiar mi **API Key**[cite: 46]. Para asegurar que todo funcionaba correctamente, realicé pruebas con la URL y la API Key en Postman, confirmando que las llamadas autenticadas devolvían los resultados esperados sin errores.

---

### Relevamiento de las APIs necesarias

[cite_start]Para resolver la problemática, definí las siguientes rutas de la API de The Movie DB[cite: 47]:

-   `GET /genre/movie/list`: Esta ruta nos permite obtener un listado de todos los géneros de películas disponibles en la API con su respectivo ID y nombre.
-   `GET /discover/movie`: Utilizaremos esta ruta para encontrar películas y filtrar por género usando el parámetro `with_genres`. El resultado de esta llamada nos proporciona el campo `total_results`, que indica la cantidad total de películas para un género específico.

Además, se agregará el parámetro `language=es-AR` a las llamadas para obtener los resultados en español.

---
