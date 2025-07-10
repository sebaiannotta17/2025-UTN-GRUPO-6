    
    // Claves y URLs de las APIs
    const API_KEY = "91c6195ee5c03e5ff0f7a7c4c8088776";
    const STRAPI_URL = "https://gestionweb.frlp.utn.edu.ar/api/g4-peliculas";
    const STRAPI_GENEROS_URL = "https://gestionweb.frlp.utn.edu.ar/api/g4-generos";
    const STRAPI_TOKEN =
    "099da4cc6cbb36bf7af8de6f1f241f8c81e49fce15709c4cfcae1313090fa2c1ac8703b0179863b4eb2739ea65ae435e90999adb870d49f9f94dcadd88999763119edca01a6b34c25be92a80ed30db1bcacb20df40e4e7f45542bd501f059201ad578c18a11e4f5cd592cb25d6c31a054409caa99f11b6d2391440e9c72611ea";

    // Diccionarios para mapear
    let generoLookupTMDB = {};
    let generoStrapiMap = {};

    // GET https://api.themoviedb.org/3/genre/movie/list?api_key=...&language=es-AR - Obtener y mapear los generos de peliculas por ID desde TMDB
    async function obtenerGenerosTMDB() {
    const res = await fetch(
        `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=es-AR`
    );
    const data = await res.json();
    data.genres.forEach((g) => {
        generoLookupTMDB[g.id] = g.name;
    });
    }

    // GET https://gestionweb.frlp.utn.edu.ar/api/g4-generos - Obtener los generos existentes desde Strapi y mapear por nombre
    async function obtenerGenerosDeStrapi() {
    try {
        const res = await fetch(STRAPI_GENEROS_URL, {
        headers: {
            Authorization: `Bearer ${STRAPI_TOKEN}`,
        },
        });
        const data = await res.json();

        if (data && data.data && Array.isArray(data.data)) {
        data.data.forEach((g) => {
            if (g.attributes && g.attributes.nombre) {
            generoStrapiMap[g.attributes.nombre] = g.id;
            } else if (g.nombre) {
            generoStrapiMap[g.nombre] = g.id;
            } else {
            console.warn("Género sin nombre válido:", g);
            }
        });
        } else {
        console.warn("Respuesta inesperada de Strapi:", data);
        }
    } catch (error) {
        console.error("Error al obtener géneros de Strapi:", error);
        throw error;
    }
    }

    // POST https://gestionweb.frlp.utn.edu.ar/api/g4-generos - Crear un nuevo genero en Strapi y retornar su ID
    async function crearGeneroEnStrapi(nombreGenero) {
    try {
        const res = await fetch(STRAPI_GENEROS_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${STRAPI_TOKEN}`,
        },
        body: JSON.stringify({
            data: {
            nombre: nombreGenero,
            },
        }),
        });

        if (res.ok) {
        const data = await res.json();
        generoStrapiMap[nombreGenero] = data.data.id;
        return data.data.id;
        } else {
        const errorText = await res.text();
        console.error("Error al crear género en Strapi:", errorText);
        return null;
        }
    } catch (error) {
        console.error("Error de red al crear género en Strapi:", error);
        return null;
    }
    }

    // Generar un array de IDs de generos desde el Strapi, crear los que no existan mediante POSTw
    async function obtenerIdsGenerosStrapi(nombresGeneros) {
    const generosIDs = [];

    for (const nombre of nombresGeneros) {
        if (generoStrapiMap[nombre]) {
        generosIDs.push({ id: generoStrapiMap[nombre] });
        } else {
        const nuevoId = await crearGeneroEnStrapi(nombre);
        if (nuevoId) {
            generosIDs.push({ id: nuevoId });
        }
        }
    }

    return generosIDs;
    }

    // GET https://api.themoviedb.org/3/discover/movie - Obtener las 10 peliculas mas votadas de TMDB y guardar en Strapi via POST
    async function cargarAPI() {
    const contenedor = document.getElementById("pantalla");
    contenedor.innerHTML = `<div class="message-info">Cargando datos...</div>`;

    try {
        await obtenerGenerosTMDB();
        console.log("Géneros de TMDB cargados:", generoLookupTMDB);

        await obtenerGenerosDeStrapi();
        console.log("Géneros de Strapi cargados:", generoStrapiMap);

        const url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&region=AR&include_adult=false&sort_by=vote_count.desc&vote_count.gte=1000&language=es-AR&page=1`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Error al obtener datos de TMDB");

        const data = await res.json();
        const top10 = data.results.slice(0, 10);
        console.log("Películas obtenidas de TMDB:", top10);

        contenedor.innerHTML = `<div class="message-info">Guardando datos en Strapi...</div>`;

        let uploadsExitosos = 0;
        for (const peli of top10) {
        const nombresGeneros = peli.genre_ids
            .map((id) => generoLookupTMDB[id])
            .filter(Boolean);
        console.log(`Procesando película: ${peli.title}`, nombresGeneros);

        const generosIDs = await obtenerIdsGenerosStrapi(nombresGeneros);
        console.log(`IDs de géneros para ${peli.title}:`, generosIDs);

        try {
            const resStrapi = await fetch(STRAPI_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${STRAPI_TOKEN}`,
            },
            body: JSON.stringify({
                data: {
                titulo: peli.title,
                sinopsis: peli.overview,
                g_4_generos: generosIDs,
                cantidad_votos: peli.vote_count,
                promedio_votos: peli.vote_average,
                },
            }),
            });

            if (resStrapi.ok) {
            const peliculaCreada = await resStrapi.json();
            console.log(`Película guardada: ${peli.title}`, peliculaCreada);
            uploadsExitosos++;
            } else {
            const error = await resStrapi.text();
            console.error(`Error al guardar ${peli.title}:`, error);
            }
        } catch (error) {
            console.error(`Error de red con ${peli.title}:`, error);
        }
        }

        if (uploadsExitosos === top10.length) {
        contenedor.innerHTML = `<div class="message-success">✔ Todas las películas se guardaron correctamente</div>`;
        } else if (uploadsExitosos > 0) {
        contenedor.innerHTML = `<div class="message-warning">⚠ Se guardaron ${uploadsExitosos} de ${top10.length} películas</div>`;
        } else {
        contenedor.innerHTML = `<div class="message-error">❌ No se pudo guardar ninguna película</div>`;
        }
    } catch (error) {
        console.error("Error en cargarAPI:", error);
        contenedor.innerHTML = `<div class="message-error">❌ Error: ${error.message}</div>`;
    }
    }

        async function verDatos() {
            const contenedor = document.getElementById("pantalla");
            contenedor.innerHTML = `<div class="message-info">Cargando datos guardados...</div>`;
        
            // GET a Strapi para obtener las 10 peliculas con sus generos relacionados (populate=g_4_generos), usando paginacion
            try {
            const res = await fetch(`${STRAPI_URL}?populate=g_4_generos&pagination[limit]=10`, {
                headers: {
                Authorization: `Bearer ${STRAPI_TOKEN}`,
                },
            });
        
            if (!res.ok) {
                throw new Error(`Error ${res.status}: ${await res.text()}`);
            }
        
            const response = await res.json();
            console.log("Respuesta de Strapi:", response);
        
            if (!response.data || !Array.isArray(response.data)) {
                throw new Error("Estructura de datos inválida");
            }
        
            contenedor.innerHTML = "";
        
            // Crear contenedor de gráfico
            const chartContainer = document.createElement("div");
            chartContainer.style.width = "100%";
            chartContainer.style.height = "500px";
            chartContainer.style.marginBottom = "30px";
        
            const canvas = document.createElement("canvas");
            canvas.id = "grafico";
            canvas.width = 600;
            canvas.height = 400;
            chartContainer.appendChild(canvas);
            contenedor.appendChild(chartContainer);
        
            // Crear contenedor de lista de películas
            const movieListContainer = document.createElement("div");
            contenedor.appendChild(movieListContainer);
        
            const labels = [];
            const promedios = [];
        
            response.data.forEach((pelicula) => {
            const attributes = pelicula.attributes || pelicula;

            const titulo = attributes?.titulo || "Sin título";
            const sinopsis = attributes?.sinopsis || "Sin sinopsis disponible";
            const votos = attributes?.cantidad_votos ?? "N/A";
            const promedio = attributes?.promedio_votos ?? 0;
            const promedioTexto = promedio.toFixed(1);

            const generoData = attributes?.g_4_generos || [];

            const generos = Array.isArray(generoData) && generoData.length
                ? generoData.map((g) => g.nombre).join(", ")
                : "(sin géneros)";

            labels.push(titulo);
            promedios.push(promedio);

            movieListContainer.innerHTML += `
                <div class="card">
                    <div class="movie-title">${titulo}</div>
                    <div class="movie-subtitle">${sinopsis}</div>
                    <div class="movie-votes">Votos: ${votos}</div>
                    <div class="movie-average">Promedio: ${promedioTexto}</div>
                    <div class="movie-genres">Géneros: ${generos}</div>
                </div>
            `;
        });
        
            // Grafico con Chart.js
            const ctx = canvas.getContext("2d");
            new Chart(ctx, {
                type: "bar",
                data: {
                labels,
                datasets: [{
                    label: "PROMEDIO DE VOTOS",
                    data: promedios,
                    backgroundColor: "rgba(54, 162, 235, 0.6)",
                    borderColor: "rgba(54, 162, 235, 1)",
                    borderWidth: 1
                }]
                },
                options: {
                indexAxis: "y",
                responsive: true,
                plugins: {
                    legend: { display: true },
                    tooltip: {
                    callbacks: {
                        label: ctx => ` ${ctx.raw} puntos`
                    }
                    }
                },
                scales: {
                    x: { beginAtZero: true, max: 10 }
                }
                }
            });
        
            } catch (error) {
            console.error("Error en verDatos:", error);
            contenedor.innerHTML = `
                <div class="message-error">
                <p><strong>Error:</strong> ${error.message}</p>
                <p>Revisá la consola para más detalles</p>
                </div>
            `;
            }
        }