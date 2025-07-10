function mostrarPeliculasSimuladas(peliculas) {
    const contenedor = document.querySelector("main");
    contenedor.innerHTML = "<h2>Películas simuladas</h2><canvas id='grafico' width='600' height='400'></canvas>";

    const labels = [];
    const promedios = [];

    peliculas.forEach(p => {
        labels.push(p.titulo);
        promedios.push(p.promedio_votos);

        const peliHTML = `
        <div style="margin-top: 20px; margin-bottom: 15px; padding: 10px; background-color: #fff; border-radius: 8px; box-shadow: 1px 1px 4px #888;">
            <h3>${p.titulo}</h3>
            <p><strong>Sinopsis:</strong> ${p.sinopsis}</p>
            <p><strong>Géneros:</strong> ${p.generos.join(", ")}</p>
            <p><strong>Votos:</strong> ${p.cantidad_votos}</p>
            <p><strong>Promedio:</strong> ${p.promedio_votos}</p>
        </div>`;
        contenedor.innerHTML += peliHTML;
    });

    const ctx = document.getElementById('grafico').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: 'Promedio de Votos (Simulado)',
                data: promedios,
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            scales: {
                x: {
                    beginAtZero: true,
                    max: 10
                }
            }
        }
    });
}

document.getElementById("api1").addEventListener("click", async () => {
    const apiKey = "91c6195ee5c03e5ff0f7a7c4c8088776";
    const tmdbBase = "https://api.themoviedb.org/3";
    const strapiBase = "https://gestionweb.frlp.utn.edu.ar/api";

    const main = document.querySelector("main");
    main.innerHTML = "<p>Cargando películas desde la API...</p>";

    try {
        const genreRes = await axios.get(`${tmdbBase}/genre/movie/list?api_key=${apiKey}&language=es-AR`);
        const genreMap = {};
        genreRes.data.genres.forEach(g => genreMap[g.id] = g.name);

        const movieRes = await axios.get(`${tmdbBase}/discover/movie?api_key=${apiKey}&region=AR&vote_count.gte=1000&sort_by=vote_count.desc&language=es-AR&page=1`);
        const top10 = movieRes.data.results.slice(0, 10);

        const generosRes = await axios.get(`${strapiBase}/g4-generos`);
        const existentes = generosRes.data.data;

        for (const movie of top10) {
            const titulo = movie.title;
            const sinopsis = movie.overview || "Sin sinopsis";
            const votos = movie.vote_count;
            const promedio = movie.vote_average;
            const generosTexto = movie.genre_ids.map(id => genreMap[id]);

            const yaExiste = await axios.get(`${strapiBase}/g4-peliculas?filters[titulo][$eq]=${encodeURIComponent(titulo)}`);
            if (yaExiste.data.data.length > 0) {
                console.log(`Ya existe: ${titulo}`);
                continue;
            }

            const generosFinal = [];
            for (const nombre of generosTexto) {
                let existente = existentes.find(g => g.attributes.nombre === nombre);

                if (!existente) {
                    const nuevo = await axios.post(`${strapiBase}/g4-generos`, {
                        data: { nombre }
                    });
                    generosFinal.push(nuevo.data.data.id);
                    existentes.push(nuevo.data.data);
                } else {
                    generosFinal.push(existente.id);
                }
            }

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

        alert("Películas cargadas correctamente en Strapi.");
        main.innerHTML = "<p>Películas cargadas con éxito.</p>";
    } catch (error) {
        console.error("Error al procesar datos:", error);
        alert("Hubo un error en la conexión con Strapi. Revisá la consola.");
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

        contenedor.innerHTML = "<h2>Películas cargadas</h2><canvas id='grafico' width='600' height='400'></canvas>";

        const labels = [];
        const promedios = [];

        peliculas.forEach(p => {
            const datos = p.attributes;
            const generos = datos.g_4_generos.data.map(g => g.attributes.nombre).join(", ");

            labels.push(datos.titulo);
            promedios.push(datos.promedio_votos);

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

        const ctx = document.getElementById('grafico').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels,
                datasets: [{
                    label: 'Promedio de Votos',
                    data: promedios,
                    backgroundColor: 'rgba(54, 162, 235, 0.6)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                indexAxis: 'y',
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

    } catch (err) {
        console.error("Error al consultar películas:", err);
        if (err.response?.status === 403) {
            alert("Permiso denegado desde Strapi. Mostrando datos simulados...");
            const pelisFake = [
                {
                    titulo: "Película simulada 1",
                    sinopsis: "Un thriller argentino lleno de tensión.",
                    generos: ["Suspenso", "Drama"],
                    cantidad_votos: 1350,
                    promedio_votos: 7.9
                },
                {
                    titulo: "Película simulada 2",
                    sinopsis: "Una comedia local que rompió récords.",
                    generos: ["Comedia"],
                    cantidad_votos: 2100,
                    promedio_votos: 8.4
                }
            ];
            mostrarPeliculasSimuladas(pelisFake);
        } else {
            alert("No se pudieron visualizar los datos. Revisá la consola.");
            contenedor.innerHTML = "<p>Error al visualizar datos.</p>";
        }
    }
});