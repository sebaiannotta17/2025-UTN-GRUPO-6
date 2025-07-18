const API_KEY = 'be1c03d69517ac3ed92e7c31c6f505cc';
const API_URL = 'https://api.themoviedb.org/3';


// Esta funcion se encarga de consultar a la API TMDB y luego retorna los generos de aquellas series en español. Retorna un array de objetos
async function getGenres() {
    const res = await fetch(`${API_URL}/genre/tv/list?api_key=${API_KEY}&language=es`);
    const data = await res.json();
    return data.genres;
}


// Obtiene las 10 series de TV más antiguas usando la API de "discover", ordenadas por fecha de estreno (first_air_date.asc).
// Va paginando hasta encontrar al menos 10 resultados válidos, Filtra los resultados que tengan first_air_date y devuelve
// un array con las primeras 10 series más antiguas (cada una con información base: id, name, genre_ids, etc.).
async function getOldestTVShows() {
    let page = 1;
    let results = [];

    while (results.length < 10 && page <= 50) {
        const res = await fetch(`${API_URL}/discover/tv?api_key=${API_KEY}&language=es&sort_by=first_air_date.asc&include_adult=false&include_null_first_air_dates=false&page=${page}`);
        const data = await res.json();

        const filtered = data.results.filter(tv => tv.first_air_date);
        results = results.concat(filtered);

        page++;
    }

    return results.slice(0, 10);
}

// Esta funcion obtiene detalles especificos de una serie particular.
// Devuelve un objetos con datos completos de la serie.
async function getTVShowDetails(tvId) {
    const res = await fetch(`${API_URL}/tv/${tvId}?api_key=${API_KEY}&language=es`);
    return await res.json();
}

//Esta funcion envia una serie en formato JSON al endpoint de Strapi de nuestro grupo,
//utilizando el método POST.

async function subirSerieAStrapi(serie) {
    const res =  await fetch('https://gestionweb.frlp.utn.edu.ar/api/serie-grupo15', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer 099da4cc6cbb36bf7af8de6f1f241f8c81e49fce15709c4cfcae1313090fa2c1ac8703b0179863b4eb2739ea65ae435e90999adb870d49f9f94dcadd88999763119edca01a6b34c25be92a80ed30db1bcacb20df40e4e7f45542bd501f059201ad578c18a11e4f5cd592cb25d6c31a054409caa99f11b6d2391440e9c72611ea'
        },
        body: JSON.stringify({
            data: {
                titulo: serie.titulo,
                sinopsis: serie.sinopsis,
                generos: serie.generos.join(', '),
                popularidad: serie.popularidad,
                pais_origen: serie.pais_origen,
            }
        })
    });
    if (!res.ok) {
    console.error("Error al subir la serie:", res.status, await res.text());
    return;
    }
    const data = await res.json();
    console.log("Respuesta de Strapi:", data);
}


// Esta funcion Renderiza las series en el DOM. Carga las series antiguas, las muestra
// y las sube a Strapi.
async function cargarSeries() {
    const genresList = await getGenres();
    const shows = await getOldestTVShows();
    const lista = document.getElementById('listaSeries');
    lista.innerHTML = ''; // Limpia el contenido anterior

    for (const show of shows) {
        const details = await getTVShowDetails(show.id);

        const showData = {
            id: show.id, 
            titulo: show.name,
            sinopsis: show.overview,
            generos: show.genre_ids.map(id => {
                const genre = genresList.find(g => g.id === id);
                return genre ? genre.name : 'Desconocido';
            }),
            popularidad: show.popularity,
            pais_origen: details.origin_country.join(', ') || 'Desconocido',
            // Añadir más detalles para el modal
            fecha_estreno: show.first_air_date || 'Desconocida',
            votos_promedio: show.vote_average || 'N/A'
             
        };
        subirSerieAStrapi(showData);

        const item = document.createElement('div');
        //Usamos los data-attributes para almacenar la información completa para el modal
        item.dataset.id = showData.id;
        item.dataset.titulo = showData.titulo;
        item.dataset.sinopsis = showData.sinopsis;
        item.dataset.generos = showData.generos.join(', ');
        item.dataset.popularidad = showData.popularidad;
        item.dataset.paisOrigen = showData.pais_origen;
        item.dataset.fechaEstreno = showData.fecha_estreno;
        item.dataset.votosPromedio = showData.votos_promedio;

        //Coloca el resultado en los elementos HTML
        item.innerHTML = `
            <h4>${showData.titulo}</h4>
            <p><strong>Sinopsis:</strong> ${showData.sinopsis || 'Sin sinopsis'}</p>
            <p><strong>Género:</strong> ${showData.generos.join(', ') || 'Sin género'}</p>
            <p><strong>Popularidad:</strong> ${showData.popularidad}</p>
            <p><strong>País de origen:</strong> ${showData.pais_origen}</p>
        `;

        // Añadir evento de clic a cada tarjeta
        item.addEventListener('click', function() {
            mostrarDetallesModal(this.dataset); // Pasamos todos los data-attributes
        });

        lista.appendChild(item);

    }
}

// Función para mostrar el modal con los detalles
function mostrarDetallesModal(data) {
    const modal = document.getElementById('modalSerie');
    document.getElementById('modalTitulo').textContent = data.titulo;
    document.getElementById('modalFechaEstreno').textContent = data.fechaEstreno;
    document.getElementById('modalVotosPromedio').textContent = data.votosPromedio;

    modal.style.display = 'flex'; // Mostrar el modal
}

// Evento para cerrar el modal
document.querySelector('.cerrar-modal').addEventListener('click', function() {
    document.getElementById('modalSerie').style.display = 'none';
});

// Cerrar el modal al hacer clic fuera del contenido del modal
window.addEventListener('click', function(event) {
    const modal = document.getElementById('modalSerie');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
});


// Listener para cargar series al hacer clic en el botón
document.getElementById('btnCargarSeries').addEventListener('click', (e) => {
    e.preventDefault(); // evitar que el href salte arriba
    cargarSeries();
});


document.getElementById('btnVolverInicio').addEventListener('click', (e) => {
    e.preventDefault();

    // Limpiar lista de series
    const lista = document.getElementById('listaSeries');
    lista.innerHTML = '';

    // Reiniciar los gráficos 
    const graficosApp = document.getElementById('graficosApp');
    graficosApp.innerHTML = `
        <div class="contenedor-graficos">
            <canvas id="grafico1"></canvas>
            <canvas id="grafico2"></canvas>
            <canvas id="grafico3"></canvas>
            <canvas id="grafico4"></canvas>
        </div>
    `;

    // Recargar los datos y renderizar nuevamente
    if (window.vueGraficoApp) {
        window.vueGraficoApp.unmount(); // desmontar si ya estaba montado
    }

    // Montar de nuevo Vue
    window.vueGraficoApp = Vue.createApp({
        setup() {
            const series = Vue.ref([]);

            Vue.onMounted(async () => {
                const genresList = await getGenres();
                const shows = await getOldestTVShows();
                const detailedShows = [];

                for (const show of shows) {
                    const details = await getTVShowDetails(show.id);
                    detailedShows.push({
                        titulo: show.name,
                        popularidad: show.popularity,
                        generos: show.genre_ids.map(id => {
                            const g = genresList.find(gen => gen.id === id);
                            return g ? g.name : 'Desconocido';
                        }),
                        pais_origen: details.origin_country.join(', ') || 'Desconocido',
                        votos: show.vote_average || 0,
                        fecha: show.first_air_date || 'Desconocida'
                    });
                }

                series.value = detailedShows;
                renderCharts(detailedShows);
            });

            function renderCharts(data) {
                const ctx1 = document.getElementById("grafico1")?.getContext("2d");
                const ctx2 = document.getElementById("grafico2")?.getContext("2d");
                const ctx3 = document.getElementById("grafico3")?.getContext("2d");
                const ctx4 = document.getElementById("grafico4")?.getContext("2d");

                if (!ctx1 || !ctx2 || !ctx3 || !ctx4) return;

                new Chart(ctx1, {
                    type: 'bar',
                    data: {
                        labels: data.map(s => s.titulo),
                        datasets: [{
                            label: 'Popularidad',
                            data: data.map(s => s.popularidad),
                            backgroundColor: '#4e79a7'
                        }]
                    }
                });

                new Chart(ctx2, {
                    type: 'line',
                    data: {
                        labels: data.map(s => s.titulo),
                        datasets: [{
                            label: 'Votos promedio',
                            data: data.map(s => s.votos),
                            borderColor: '#f28e2b',
                            fill: false
                        }]
                    }
                });

                new Chart(ctx3, {
                    type: 'pie',
                    data: {
                        labels: [...new Set(data.flatMap(s => s.pais_origen.split(', ')))],
                        datasets: [{
                            label: 'Países de origen',
                            data: [...new Set(data.flatMap(s => s.pais_origen.split(', ')))].map(pais =>
                                data.filter(s => s.pais_origen.includes(pais)).length),
                            backgroundColor: ['#59a14f', '#edc948', '#b07aa1', '#ff9da7', '#9c755f']
                        }]
                    }
                });

                new Chart(ctx4, {
                    type: 'bar',
                    data: {
                        labels: data.map(s => s.titulo),
                        datasets: [{
                            label: 'Cantidad de géneros',
                            data: data.map(s => s.generos.length),
                            backgroundColor: '#bab0ac'
                        }]
                    }
                });
            }

            return {};
        }
    }).mount("#graficosApp");

    // Vuelve al inicio de la pantalla, scrolleando suavemente hacia arriba
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});



// graficos.js
const { createApp, onMounted, ref } = Vue;

createApp({
  setup() {
    const series = ref([]);

    onMounted(async () => {
      const genresList = await getGenres();
      const shows = await getOldestTVShows();
      const detailedShows = [];

      for (const show of shows) {
        const details = await getTVShowDetails(show.id);
        detailedShows.push({
          titulo: show.name,
          popularidad: show.popularity,
          generos: show.genre_ids.map(id => {
            const g = genresList.find(gen => gen.id === id);
            return g ? g.name : 'Desconocido';
          }),
          pais_origen: details.origin_country.join(', ') || 'Desconocido',
          votos: show.vote_average || 0,
          fecha: show.first_air_date || 'Desconocida'
        });
      }

      series.value = detailedShows;
      renderCharts(detailedShows);
    });

    function renderCharts(data) {
      const ctx1 = document.getElementById("grafico1").getContext("2d");
      const ctx2 = document.getElementById("grafico2").getContext("2d");
      const ctx3 = document.getElementById("grafico3").getContext("2d");
      const ctx4 = document.getElementById("grafico4").getContext("2d");

      new Chart(ctx1, {
        type: 'bar',
        data: {
          labels: data.map(s => s.titulo),
          datasets: [{
            label: 'Popularidad',
            data: data.map(s => s.popularidad),
            backgroundColor: '#4e79a7'
          }]
        }
      });

      new Chart(ctx2, {
        type: 'line',
        data: {
          labels: data.map(s => s.titulo),
          datasets: [{
            label: 'Votos promedio',
            data: data.map(s => s.votos),
            borderColor: '#f28e2b',
            fill: false
          }]
        }
      });

      new Chart(ctx3, {
            type: 'pie',
            data: {
                labels: [...new Set(data.flatMap(s => s.pais_origen.split(', ')))],
                datasets: [{
                label: 'Países de origen',
                data: [...new Set(data.flatMap(s => s.pais_origen.split(', ')))].map(pais =>
                    data.filter(s => s.pais_origen.includes(pais)).length),
                backgroundColor: ['#59a14f', '#edc948', '#b07aa1', '#ff9da7', '#9c755f']
                }]
            },
            options: {
                plugins: {
                title: {
                    display: true,
                    text: 'Distribución por país de origen'
                }
                }
            }
            });

      // Obtener todos los géneros en una lista plana
        const allGenres = data.flatMap(s => s.generos);

        // Contar ocurrencias de cada género
        const genreCounts = {};
        allGenres.forEach(g => {
        genreCounts[g] = (genreCounts[g] || 0) + 1;
        });

        // Crear gráfico de géneros
        new Chart(ctx4, {
        type: 'bar',
        data: {
            labels: Object.keys(genreCounts),
            datasets: [{
            label: 'Frecuencia de géneros',
            data: Object.values(genreCounts),
            backgroundColor: '#bab0ac'
            }]
        }
        });

    }

    return {};
  }
}).mount("#graficosApp");


