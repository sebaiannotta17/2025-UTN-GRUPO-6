document.addEventListener('DOMContentLoaded', () => {
    const homeContent = document.getElementById('home-content');
    const linkGameAPI = document.getElementById('linkAPI1');
    const linkDogAPI = document.getElementById('linkAPI2');

    const phrases = [
        { text: "Cuando un hombre aprende a amar, debe asumir el riesgo del odio.", class: "shadow1" },
        { text: "La gente no cambia. Solo revelan quiénes son realmente", class: "shadow2" },
        { text: "La soledad es una fuerza muy poderosa.", class: "shadow3" }
    ];

    const expectations = `
        <p class="expectations-paragraph">
            Mis expectativas en la cátedra de TygWeb son adquirir las bases sobre el desarrollo web,
            desde la construcción de interfaces hasta la integración con APIs y la gestión de datos.
            Espero poder aplicar los conceptos teóricos en proyectos reales que me permitan fortalecer mis habilidades
            y comprender mejor el desarrollo web.
        </p>
    `;

    function loadHomeContent() {
        const randomIndex = Math.floor(Math.random() * phrases.length);
        const randomPhrase = phrases[randomIndex];

        homeContent.innerHTML = `
            <p class="phrase ${randomPhrase.class}">${randomPhrase.text}</p>
            ${expectations}
        `;
    }

    loadHomeContent();


    const RAWG_API_KEY = '5c71393ecee54a7085fd7e41b6e8d610';

    linkGameAPI.addEventListener('click', async (e) => {
        e.preventDefault();


        homeContent.innerHTML = '<h2>Cargando información del videojuego...</h2><p>Fuente: RAWG API</p>';
        const gameName = 'GTA 5'; 
        const url = `https://api.rawg.io/api/games?key=${RAWG_API_KEY}&search=${encodeURIComponent(gameName)}`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Error HTTP! Estado: ${response.status}.`);
            }
            const data = await response.json();

            let contentHtml = `<h2>Información de ${gameName}:</h2>`;

            if (data.results && data.results.length > 0) {
                const game = data.results[0];
                contentHtml += `
                    <div class="api-card">
                        <h3>${game.name}</h3>
                        <div class="image-gallery">
                            ${game.background_image ? `<div class="image-item"><img src="${game.background_image}" alt="Imagen de Fondo" style="width: 200px; height: auto;"><span>Fondo</span></div>` : ''}
                            ${game.short_screenshots && game.short_screenshots.length > 0 ? `<div class="image-item"><img src="${game.short_screenshots[0].image}" alt="Captura 1" style="width: 200px; height: auto;"><span>Captura</span></div>` : ''}
                        </div>
                        <p><strong>Fecha de Lanzamiento:</strong> ${game.released || 'N/A'}</p>
                        <p><strong>Rating:</strong> ${game.rating || 'N/A'}/5 (${game.ratings_count || 0} votos)</p>
                        <p><strong>Plataformas:</strong> ${game.platforms ? game.platforms.map(p => p.platform.name).join(', ') : 'N/A'}</p>
                        <p><strong>Géneros:</strong> ${game.genres ? game.genres.map(g => g.name).join(', ') : 'N/A'}</p>
                        <p>
                        </p>
                    </div>
                `;
            } else {
                contentHtml += `<p>No se encontró información para ${gameName}.</p>`;
            }
            homeContent.innerHTML = contentHtml;
        } catch (error) {
            homeContent.innerHTML = `<p style="color: red;">Error al cargar datos del videojuego: ${error.message}</p>`;
            console.error("Error", error);
        }
    });

    linkDogAPI.addEventListener('click', async (e) => {
        e.preventDefault();
        homeContent.innerHTML = '<h2>Cargando imagen de perro aleatoria...</h2><p>Fuente: Dog CEO API</p>';
        const url = 'https://dog.ceo/api/breeds/image/random';

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Error HTTP! Estado: ${response.status}`);
            }
            const data = await response.json();

            let contentHtml = `<h2></h2>`;

            if (data.status === 'success' && data.message) {
                const imageUrl = data.message;
                const breed = imageUrl.split('/')[4] || 'desconocida';

                contentHtml += `
                    <div class="api-card">
                        <h3>Raza: ${breed.charAt(0).toUpperCase() + breed.slice(1).replace(/-/g, ' ')}</h3>
                        <div class="image-gallery">
                            <div class="image-item">
                                <img src="${imageUrl}" alt="Imagen de Perro Aleatoria" style="max-width: 100%; height: auto;">
                                <span></span>
                            </div>
                        </div>
                        <p></p>
                    </div>
                `;
            } else {
                contentHtml += `<p>No se pudo cargar la imagen del perro.</p>`;
            }
            homeContent.innerHTML = contentHtml;
        } catch (error) {
            homeContent.innerHTML = `<p style="color: red;">Error al cargar imagen de perro: ${error.message}</p>`;
            console.error("Error", error);
        }
    });
});