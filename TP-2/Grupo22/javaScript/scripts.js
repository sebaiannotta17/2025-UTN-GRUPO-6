document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("anioPelicula");
    const input = document.getElementById("anio");
    const contenedor = document.querySelector(".contenidoApi");
    const cargarDatosBtn = document.querySelector(".nav p:first-child"); // Selecciona el primer p del nav

    const API_KEY = "2039040a62d787aa83335b6c031d38b7";
    const STRAPI_URL = "https://gestionweb.frlp.utn.edu.ar/api/g22-peliculas";
    const STRAPI_TOKEN = "099da4cc6cbb36bf7af8de6f1f241f8c81e49fce15709c4cfcae1313090fa2c1ac8703b0179863b4eb2739ea65ae435e90999adb870d49f9f94dcadd88999763119edca01a6b34c25be92a80ed30db1bcacb20df40e4e7f45542bd501f059201ad578c18a11e4f5cd592cb25d6c31a054409caa99f11b6d2391440e9c72611ea";

    // Función para cargar datos
    const cargarDatos = async (e) => {
        if(e) e.preventDefault();
        
        const anio = input.value;
        if(!anio || anio < 1900 || anio > 2025) {
            alert("Por favor ingrese un año válido entre 1900 y 2025");
            return;
        }
        
        contenedor.innerHTML = "<p>Cargando películas...</p>";

        try {
            // 1. Obtener datos de la API de películas
            console.log("Consultando API de películas...");
            const moviesResponse = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=es-ES&sort_by=popularity.desc&primary_release_year=${anio}`);
            
            if (!moviesResponse.ok) {
                throw new Error("Error al obtener películas");
            }
            
            const moviesData = await moviesResponse.json();

            if (!moviesData.results || moviesData.results.length === 0) {
                contenedor.innerHTML = `<p>No se encontraron películas para el año ${anio}.</p>`;
                return;
            }

            // 2. Procesar top 3 películas
            const top3 = moviesData.results.slice(0, 3);
            contenedor.innerHTML = `<h2>Top 3 películas del año ${anio}</h2>`;

            for (let pelicula of top3) {
                const titulo = pelicula.title;
                const popularidad = Math.round(pelicula.popularity);
                const imagen = pelicula.poster_path 
                    ? `https://image.tmdb.org/t/p/w200${pelicula.poster_path}`
                    : 'https://via.placeholder.com/200x300?text=No+Imagen';

                // Mostrar en pantalla
                const div = document.createElement("div");
                div.className = "pelicula";
                div.innerHTML = `
                    <img src="${imagen}" alt="${titulo}">
                    <h3>${titulo}</h3>
                    <p>Popularidad: ${popularidad}</p>
                `;
                contenedor.appendChild(div);

                // 3. Guardar en Strapi
                try {
                    console.log(`Intentando guardar: ${titulo}`);
                    
                    const strapiResponse = await fetch(STRAPI_URL, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${STRAPI_TOKEN}`
                        },
                        body: JSON.stringify({
                            data: {
                                titulo: titulo,
                                popularidad: popularidad,
                                imagen: imagen,
                                anio: parseInt(anio),
                            }
                        })
                    });

                    const strapiData = await strapiResponse.json();
                    console.log("Respuesta de Strapi:", strapiData);

                    if (!strapiResponse.ok) {
                        console.error(`Error al guardar "${titulo}":`, strapiData);
                        throw new Error(`Error Strapi: ${strapiResponse.status}`);
                    }

                    console.log(`Película guardada: ${titulo}`, strapiData.data);

                } catch (strapiError) {
                    console.error(`Error al guardar en Strapi:`, strapiError);
                }
            }

        } catch (error) {
            contenedor.innerHTML = `
                <p style="color: red;">Error en el proceso</p>
                <p>${error.message}</p>
            `;
            console.error("Error completo:", error);
        }
    };

    // Asociar eventos
    form.addEventListener("submit", cargarDatos);
    cargarDatosBtn.addEventListener("click", cargarDatos);
});