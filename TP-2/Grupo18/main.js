document.addEventListener("DOMContentLoaded", function () {
    const origin = document.getElementById('origin');
    const linkPelicula = document.getElementById('linkPelicula');
    const linkStrapi = document.getElementById('linkStrapi');
    const peliculas = document.getElementById('peliculas');
    const strapi = document.getElementById('strapi');

    peliculas.style.display = "none";
    strapi.style.display = "none";

    linkPelicula.addEventListener("click", (event) => {
        event.preventDefault();
        origin.innerHTML = ``;
        peliculas.style.display = "block";
        strapi.style.display = "none";
        cargarPeliculas();
    });

    linkStrapi.addEventListener("click", (event) => {
        event.preventDefault();
        origin.innerHTML = ``;
        peliculas.style.display = "none";
        strapi.style.display = "block";
        mostrarEpisodiosStrapi();
    });
});

function formatearFecha(fechaISO) {
    if (!fechaISO) return 'No disponible';
    const fecha = new Date(fechaISO);
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const anio = fecha.getFullYear();
    return `${dia}/${mes}/${anio}`;
}

async function cargarPeliculas() {
    const apiKey = "a97b100612d4c3f5e43a68842f284c39";
    const apiUrl = `https://api.themoviedb.org/3/tv/1418/season/3?api_key=${apiKey}&language=es-AR`;
    const imgUrl = "https://image.tmdb.org/t/p/w500";
    const containerPeliculas = document.getElementById('container-peliculas');
    
    if (!containerPeliculas) return;

    containerPeliculas.innerHTML = '<div class="text-center my-5"><div class="spinner-border text-primary" role="status"></div></div>';
    axios.get(apiUrl)
        .then(response => {
            const lista = response.data && response.data.episodes ? response.data.episodes : [];
            if (lista.length === 0) {
                containerPeliculas.innerHTML = '<div class="alert alert-warning">No hay episodios disponibles.</div>';
                return;
            }
            containerPeliculas.innerHTML = "";
            lista.forEach(epi => {
                containerPeliculas.innerHTML += `
                    <div class="col-12 mb-4">
                        <div class="card flex-column flex-md-row h-100 shadow">
                            <img src="${epi.still_path ? imgUrl + epi.still_path : ''}" class="card-img-episodio" alt="${epi.name}">
                            <div class="card-body d-flex flex-column justify-content-between">
                                <div>
                                    <h5 class="card-title">${epi.episode_number}. ${epi.name}</h5>
                                    <p class="d-none d-lg-block card-text-resumen">${epi.overview || 'Sin descripción.'}</p>
                                </div>
                                <button type="button" class="btn btn-detalles mt-2 w-100" data-bs-toggle="modal" data-bs-target="#modal-${epi.id}">
                                    Ver Detalles
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="modal fade" id="modal-${epi.id}" tabindex="-1" aria-hidden="true">
                        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title">
                                        ${epi.episode_number}. ${epi.name}
                                    </h5>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div class="modal-body">
                                    <p>
                                        <strong><i class="bi bi-calendar4-event me-1"></i> Fecha de emisión:</strong> ${formatearFecha(epi.air_date)}
                                    </p>
                                    <p>
                                        <strong><i class="bi bi-card-text me-1"></i> Sinopsis:</strong> ${epi.overview || 'No disponible'}
                                    </p>
                                    <p>
                                        <strong><i class="bi bi-clock me-1"></i> Duración:</strong> ${epi.runtime ? epi.runtime + ' minutos' : 'No disponible'}
                                    </p>
                                    <p>
                                        <strong><i class="bi bi-people-fill me-1"></i> Votos:</strong> ${epi.vote_count ? epi.vote_count + ' votos' : 'No disponible'}
                                    </p>
                                    <p>
                                        <strong><i class="bi bi-star-fill text-warning me-1"></i> Calificación:</strong> ${epi.vote_average ? epi.vote_average.toFixed(1) : 'No disponible'}
                                    </p>
                                    <button type="button" class="btn btn-success w-100 mt-2 guardar-strapi"
                                        data-epi='${JSON.stringify({
                                            numEpisodio: epi.episode_number,
                                            nomEpisodio: epi.name,
                                            fecEstreno: epi.air_date,
                                            sinopsis: epi.overview || 'No disponible',
                                            duracionEpisodio: epi.runtime || 0,
                                            cantVotos: epi.vote_count || 0,
                                            promVotos: epi.vote_average || 0
                                        })}'
                                        data-bs-dismiss="modal">
                                        <i class="bi bi-cloud-arrow-up"></i> Guardar en Strapi
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            });
            
            setTimeout(() => {
                document.querySelectorAll('.guardar-strapi').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const epiData = JSON.parse(this.getAttribute('data-epi'));
                        guardarEpisodioStrapi(epiData);
                    });
                });
            }, 100);
        })
        .catch((err) => {
            containerPeliculas.innerHTML = '<div class="alert alert-danger">Error al conectar con TMDb.</div>';
            console.error("Error al obtener episodios:", err);
        });
}

// --- FUNCIONES PARA STRAPI ---

const strapiUrl = "https://gestionweb.frlp.utn.edu.ar";
const strapiToken = '099da4cc6cbb36bf7af8de6f1f241f8c81e49fce15709c4cfcae1313090fa2c1ac8703b0179863b4eb2739ea65ae435e90999adb870d49f9f94dcadd88999763119edca01a6b34c25be92a80ed30db1bcacb20df40e4e7f45542bd501f059201ad578c18a11e4f5cd592cb25d6c31a054409caa99f11b6d2391440e9c72611ea';
const strapiApiUrl = `${strapiUrl}/api/g18s`;

axios.defaults.headers.common['Authorization'] = `Bearer ${strapiToken}`;

async function guardarEpisodioStrapi(epiData) {
    axios.post(strapiApiUrl, { data: epiData })
        .then(res => {
            alert('¡Episodio guardado en Strapi!');
        })
        .catch(err => {
            alert('Error al guardar en Strapi');
            console.error('Error detalle:', JSON.stringify(err.response ? err.response.data : err));
        });
}

async function obtenerEpisodiosStrapi(callback) {
    axios.get(strapiApiUrl)
        .then(res => {
            const episodios = res.data.data;
            callback(episodios);
        })
        .catch(err => {
            console.error('Error al obtener episodios de Strapi:', err);
            alert('Error al obtener episodios de Strapi');
            callback([]);
        });
}

async function mostrarEpisodiosStrapi() {
    const containerStrapi = document.getElementById('container-strapi');
    if (!containerStrapi) return;
    obtenerEpisodiosStrapi(episodios => {
        if (!episodios.length) {
            containerStrapi.innerHTML = `<div class="alert alert-warning">No hay episodios guardados en Strapi.</div>`;
            return;
        }
        let tabla = `
            <div class="table-responsive rounded-4 shadow">
            <table class="table table-striped table-bordered align-middle">
                <thead class="table-dark">
                    <tr>
                        <th>#</th>
                        <th>Nombre</th>
                        <th>Fecha de emisión</th>
                        <th>Sinopsis</th>
                        <th>Duración</th>
                        <th>Votos</th>
                        <th>Calificación</th>
                    </tr>
                </thead>
                <tbody>
        `;
        const labels = [];
        const calificaciones = [];
        episodios.forEach((item, idx) => {
            const num = item.numEpisodio || idx + 1;
            const nom = item.nomEpisodio || 'Sin nombre';
            const cal = parseFloat(item.promVotos) || 0;
            labels.push(`Episodio ${num}`);
            calificaciones.push(cal);
            tabla += `
                <tr>
                    <td>${item.numEpisodio || idx + 1}</td>
                    <td>${item.nomEpisodio || 'Sin nombre'}</td>
                    <td>${formatearFecha(item.fecEstreno) || '-'}</td>
                    <td>${item.sinopsis || '-'}</td>
                    <td>${item.duracionEpisodio || '-'} min</td>
                    <td>${item.cantVotos || '-'}</td>
                    <td>${item.promVotos.toFixed(1) || '-'}</td>
                </tr>
            `;
        });
        tabla += `
                </tbody>
            </table>
            </div>
            <div class="mt-4 mb-4">
                <h5 class="text-center">Calificaciones por episodio</h5>
                <canvas id="graphCalificaciones" height="150"></canvas>
            </div>
        `;
        containerStrapi.innerHTML = tabla;

        const ctx = document.getElementById('graphCalificaciones').getContext('2d');
        const grads = calificaciones.map(() => { 
            const grad = ctx.createLinearGradient(0, 0, 0, 600);
            grad.addColorStop(0, '#0abf13ff');
            grad.addColorStop(1, '#c80707ff');
            return grad;
        });
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Calificación',
                    data: calificaciones,
                    backgroundColor: grads
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 10,
                        title: {
                            display: true,
                            text: 'Calificación',
                            color: '#fff'
                        },
                        ticks: {
                            color: '#fff'
                        },
                        grid: {
                            color: '#fff'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Episodios',
                            color: '#fff'
                        },
                        ticks: {
                            color: '#fff'
                        },
                        grid: {
                            color: '#fff'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: ctx => `Nota: ${ctx.parsed.y}`
                        }
                    }
                }
            }
        });
    });
}