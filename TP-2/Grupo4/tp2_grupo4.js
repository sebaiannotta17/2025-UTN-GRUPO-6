document.getElementById("api1").addEventListener("click", async () => {
    const apiKey = "91c6195ee5c03e5ff0f7a7c4c8088776";
    const tmdbBase = "https://api.themoviedb.org/3";
    const strapiBase = "https://gestionweb.frlp.utn.edu.ar/api";

    const main = document.querySelector("main");
    main.innerHTML = "<p>Cargando películas desde la API...</p>";

    try {
        // 1. Obtener géneros desde TMDB
        const genreRes = await axios.get(`${tmdbBase}/genre/movie/list?api_key=${apiKey}&language=es-AR`);
        const genreMap = {};
        genreRes.data.genres.forEach(g => genreMap[g.id] = g.name);

        // 2. Obtener películas de Argentina más votadas
        const movieRes = await axios.get(`${tmdbBase}/discover/movie?api_key=${apiKey}&region=AR&vote_count.gte=1000&sort_by=vote_count.desc&language=es-AR&page=1`);
        const top10 = movieRes.data.results.slice(0, 10);

        // 3. Obtener géneros existentes en Strapi
        const generosRes = await axios.get(`${strapiBase}/g4-generos`);
        const existentes = generosRes.data.data;

        for (const movie of top10) {
            const titulo = movie.title;
            const sinopsis = movie.overview || "Sin sinopsis";
            const votos = movie.vote_count;
            const promedio = movie.vote_average;
            const generosTexto = movie.genre_ids.map(id => genreMap[id]);

            // 4. Validar si ya existe la película en Strapi
            const yaExiste = await axios.get(`${strapiBase}/g4-peliculas?filters[titulo][$eq]=${encodeURIComponent(titulo)}`);
            if (yaExiste.data.data.length > 0) {
                console.log(`Ya existe: ${titulo}`);
                continue;
            }

            // 5. Asegurar que los géneros estén en Strapi y obtener sus IDs
            const generosFinal = [];
            for (const nombre of generosTexto) {
                let existente = existentes.find(g => g.attributes.nombre === nombre);

                if (!existente) {
                    const nuevo = await axios.post(`${strapiBase}/g4-generos`, {
                        data: { nombre }
                    });
                    generosFinal.push(nuevo.data.data.id);
                    existentes.push(nuevo.data.data); // actualizar cache
                } else {
                    generosFinal.push(existente.id);
                }
            }

            // 6. Crear la película en Strapi
            await axios.post(`${strapiBase}/g4-peliculas`, {
                data: {
                    titulo,
                    sinopsis,
                    cantidad_votos: votos,
                    promedio_votos: promedio,
                    g_4_generos: generosFinal
                }
            });

            console.log(`Cargada: ${titulo}`);
        }

        alert("¡Películas cargadas correctamente en Strapi! 🎉");
        main.innerHTML = "<p>Películas cargadas con éxito.</p>";
    } catch (error) {
        console.error("Error al procesar datos:", error);
        alert("Hubo un error. Revisá la consola.");
        main.innerHTML = "<p>Error al cargar datos. Ver consola.</p>";
    }
});

document.getElementById("api2").addEventListener("click", async () => {
    const strapiBase = "https://gestionweb.frlp.utn.edu.ar/api";

    const contenedor = document.querySelector("main");
    contenedor.innerHTML = "<p>Cargando visualización...</p>";

    try {
        const res = await axios.get(`${strapiBase}/g4-peliculas?populate=g_4_generos`);
        const peliculas = res.data.data;

        contenedor.innerHTML = "<h2>Películas cargadas</h2>";

        peliculas.forEach(p => {
            const datos = p.attributes;
            const generos = datos.g_4_generos.data.map(g => g.attributes.nombre).join(", ");

            const peliHTML = `
            <div style="margin-bottom: 20px; padding: 10px; background-color: #fff; border-radius: 8px; box-shadow: 1px 1px 4px #888;">
                <h3>${datos.titulo}</h3>
                <p><strong>Sinopsis:</strong> ${datos.sinopsis}</p>
                <p><strong>Géneros:</strong> ${generos}</p>
                <p><strong>Votos:</strong> ${datos.cantidad_votos}</p>
                <p><strong>Promedio:</strong> ${datos.promedio_votos}</p>
            </div>`;
            
            contenedor.innerHTML += peliHTML;
        });

    } catch (err) {
        console.error("Error al consultar películas:", err);
        alert("No se pudieron visualizar los datos. Revisá la consola.");
        contenedor.innerHTML = "<p>Error al visualizar datos.</p>";
    }
});