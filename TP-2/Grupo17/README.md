# TP2 - Películas de Tom Cruise

## Descripción

Aplicación web que obtiene información de películas donde ha actuado Tom Cruise desde la API de The Movie Database (TMDB) y las guarda en una base de datos Strapi.

## Funcionalidades

- **Cargar Películas**: Obtiene las 10 películas más votadas de Tom Cruise desde TMDB y las guarda en Strapi
- **Mostrar Películas**: Muestra las películas guardadas en Strapi ordenadas por cantidad de votos

## Datos Obtenidos

Para cada película se guarda:

- **Título**: Nombre de la película
- **Sinopsis**: Descripción de la película
- **Géneros**: Lista de géneros cinematográficos
- **Cantidad de Votos**: Número total de votos recibidos
- **Promedio de Votos**: Calificación promedio (0-10)

## Tecnologías Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **APIs**:
  - The Movie Database (TMDB) - Para obtener datos de películas
  - Strapi - Para almacenar los datos

## Configuración

El proyecto utiliza las siguientes APIs configuradas:

### TMDB API

- **API Key**: Configurada en `script.js`
- **Endpoint**: `https://api.themoviedb.org/3/`

### Strapi API

- **URL**: `https://gestionweb.frlp.utn.edu.ar/api/g17s`
- **Token**: Configurado en `script.js`

---

### División de Tareas

Cada integrante del grupo participó en distintas etapas del proyecto. A continuación, se detallan las tareas realizadas y los miembros responsables de cada una:

**📄 Documento de Entrega**
*Todos los integrantes*: participaron en la redacción del documento de entrega y la organización general del trabajo.

**🔍 Investigación del sitio**
*Tomás Bellizzi y Luca Giordani*: investigaron el sitio oficial de TMDB, explorando las funcionalidades disponibles y su documentación para entender cómo obtener información sobre Tom Cruise.

**🔐 Creación de cuenta y autenticación**
*Tomás Bellizzi y Lucas Legorburu*: se encargaron de registrar el proyecto en TMDB, crear el collection type en Strapi, obtener la API Key y configurar correctamente la autenticación.

**🔎 Relevamiento de APIs necesarias**
*Joaquín Rodríguez y Facundo Devida*: identificaron y analizaron los endpoints relevantes de la API (películas, actores, géneros) para resolver el problema planteado.

**💡 Lógica de negocio a aplicar**
*Lucas Legorburu y Facundo Devida*: definieron una lógica de carga y visualización que evita duplicados y no requiere el uso de datos simulados, basándose en los datos reales proporcionados por la API.

**💻 Desarrollo del Frontend**
*Tomás Bellizzi y Luca Giordani*: diseñaron y desarrollaron la interfaz web siguiendo el layout sugerido por la cátedra, integrando las funcionalidades de carga y visualización de películas.



