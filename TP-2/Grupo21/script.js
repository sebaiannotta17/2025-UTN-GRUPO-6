//https://gestionweb.frlp.utn.edu.ar/api/g21-actors?populate=*


//token de acceso a la api 
//eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhMGEyMDAyMzMxNDg1ZGU0YzQ3ZmRjYjE3ZDY0ZDM2ZCIsIm5iZiI6MTc1MjA2OTA2OS41OCwic3ViIjoiNjg2ZTczY2QzNDUzZDkyZDE0ZTgwMzIwIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.Zv8s4ms1gUW0ojuTcpjKkllxVUTeGJiZtbsi4MyKf5A


//api KEY 
//a0a2002331485de4c47fdcb17d64d36d

const strapiUrl = 'https://gestionweb.frlp.utn.edu.ar'; //url de la api de strapi
const strapiToken = '099da4cc6cbb36bf7af8de6f1f241f8c81e49fce15709c4cfcae1313090fa2c1ac8703b0179863b4eb2739ea65ae435e90999adb870d49f9f94dcadd88999763119edca01a6b34c25be92a80ed30db1bcacb20df40e4e7f45542bd501f059201ad578c18a11e4f5cd592cb25d6c31a054409caa99f11b6d2391440e9c72611ea' 
 //token de autenticacion para hacer operaciones en la api de strapi
const tmdbApiKey = 'a0a2002331485de4c47fdcb17d64d36d'; //token de tmdb

document.addEventListener('DOMContentLoaded', () => {  //espera a que todo el html este cargado antes de ejecutar el codigo
    const linkVisualizar = document.getElementById('link-visualizar-datos');
    const contenido = document.querySelector('.contenido');
    const linkCargar = document.getElementById('link-cargar-datos');

    //Evita que el enlace recargue la página; llama a mostrarFormularioBusqueda() para mostrar el formulario
    linkVisualizar.addEventListener('click', (e) => {
        e.preventDefault();
        mostrarFormularioBusqueda();
    });

    //se muestra un mensaje de "cargar pelicula" cuando clickeas en "cargar datos de api"

    linkCargar.addEventListener('click', (e) => {
        e.preventDefault();
        //obtiene la referancia de resultado-pelicula porque en ese div es en donde se va a mostar el cargando peliculas
        const resultado = document.
        getElementById('resultado-pelicula')
        resultado.innerHTML = '<p style="font-weight:bold;">Cargando películas...</p>';

         setTimeout(() => {
                resultado.innerHTML = ''; // limpia el mensaje cuando termina la carga
            }, 600);
    });

    function mostrarFormularioBusqueda() {
        contenido.innerHTML = `
            <h2>Buscar actores principales de una película</h2>
            <form id="form-buscar-pelicula">
                <label for="pelicula-id">ID de la película:</label>
                <input type="text" id="pelicula-id" required>
                <button type="submit">Buscar</button>
            </form>
            <div id="resultado-pelicula"></div>
        `;
        document.getElementById('form-buscar-pelicula').addEventListener('submit', buscarPelicula);
    }

    async function buscarPelicula(event) {
        event.preventDefault();
        //toma el id ingresado
        const id = document.getElementById('pelicula-id').value.trim();
        const resultado = document.getElementById('resultado-pelicula');
        // Eliminar todos los h2 y forms de búsqueda de forma definitiva
        document.querySelectorAll('h2#titulo-busqueda-pelicula').forEach(el => el.remove());
        document.querySelectorAll('form#form-buscar-pelicula').forEach(el => el.remove());
        // Forzar reflow
        document.querySelector('.contenido').offsetHeight;
        // Mostrar el resultado
        resultado.innerHTML = '<p>Cargando...</p>';
        try {
            // Obtener datos de la película
            const resPelicula = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${tmdbApiKey}&language=es-ES`);
            if (!resPelicula.ok) throw new Error('Película no encontrada');
            const pelicula = await resPelicula.json();

            // Obtener créditos (actores)
            const resCreditos = await fetch(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${tmdbApiKey}&language=es-ES`);
            if (!resCreditos.ok) throw new Error('No se pudieron obtener los actores');
            const creditos = await resCreditos.json();
            const actores = (creditos.cast || []).slice(0, 5);

            resultado.innerHTML = `
                <div class="resultado-flex">
                  <div class="resultado-poster">
                    <h3>${pelicula.title}</h3>
                    <img src="https://image.tmdb.org/t/p/w300${pelicula.poster_path}" alt="Poster de ${pelicula.title}">
                  </div>
                  <div class="resultado-actores">
                    <h4>5 actores más importantes:</h4>
                    <ol>
                      ${actores.map(actor => `<li>${actor.name}</li>`).join('')}
                    </ol>
                  </div>
                </div>
                <div style="margin-top:2rem; text-align:center;">
                  <a href="#" id="volver-buscar">Volver a buscar otra película</a>
                </div>
            `;
            // Agrego el evento para volver a buscar
            document.getElementById('volver-buscar').addEventListener('click', (e) => {
                e.preventDefault();
                mostrarFormularioBusqueda();
                resultado.innerHTML = '';
            });

            // Guardar en Strapi
            try {
                // 1. Buscar o crear actores en Strapi y obtener sus IDs
                const actorIds = [];
                for (const actor of actores) {
                    // Separar nombre y apellido (simple: primer palabra = nombre, resto = apellido)
                    const partes = actor.name.split(' ');
                    const nombre = partes[0];
                    const apellido = partes.slice(1).join(' ') || '-';

                    // Buscar actor por nombre y apellido
                    const res = await fetch(`${strapiUrl}/api/G21-actors?filters[nombre][$eq]=${encodeURIComponent(nombre)}&filters[apellido][$eq]=${encodeURIComponent(apellido)}`, {
                        headers: { 'Authorization': `Bearer ${strapiToken}` } //bearer es un tipo de autenticación; en este caso lo uso para autorizar el acceso a recursos protegidos mediante el token de strapi.
                    });
                    const data = await res.json();
                    let actorId;
                    if (data.data && data.data.length > 0) {
                        // Ya existe, usar su id
                        actorId = data.data[0].id;
                        console.log(`Actor ya existente: ${nombre} ${apellido} (ID: ${actorId})`);
                    } else {
                        // No existe, crearlo
                        const resCreate = await fetch(`${strapiUrl}/api/G21-actors`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${strapiToken}`
                            },
                            body: JSON.stringify({ data: { nombre, apellido } })
                        });
                        const dataCreate = await resCreate.json();
                        actorId = dataCreate.data.id;
                        console.log(`Actor creado: ${nombre} ${apellido} (ID: ${actorId})`)
                    }
                    actorIds.push(actorId);
                }

                // 2. Crear la película en Strapi con la relación a los actores
                const peliculaData = {
                    titulo: pelicula.title,
                    idPelicula: pelicula.id.toString(),
                    poster: `https://image.tmdb.org/t/p/w300${pelicula.poster_path}`,
                    g_21_actors: actorIds
                };
                console.log("Datos que se enviarán a Strapi:", peliculaData);
                const resPeliculaStrapi = await fetch(`${strapiUrl}/api/G21-peliculas`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${strapiToken}`
                },
                body: JSON.stringify({ data: peliculaData })
            });

            const peliculaGuardada = await resPeliculaStrapi.json();
            console.log("🎬 Película guardada en Strapi:");
            console.log(peliculaGuardada);
                //resultado.innerHTML += '<p style="color:green;">Película y actores guardados en Strapi</p>';
            } catch (err) {
                //resultado.innerHTML += '<p style="color:red;">No se pudo guardar en Strapi</p>';
            }
        } catch (err) {
            //si hay error hago que me muestre el link para volver a buscar una pelicula
            resultado.innerHTML = `<p style="color:red;">${err.message}</p>
            <div style="margin-top: 1rem; text-align:center;">
            <a href="#" id="volver-buscar">Volver a buscar otra película</a>
            </div>`;
            document.getElementById('volver-buscar').addEventListener('click', (e) => {
                e.preventDefault();
                mostrarFormularioBusqueda();
            });

        }
    }
});
