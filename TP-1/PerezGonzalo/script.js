document.addEventListener('DOMContentLoaded', function() {
    // Mostrar fecha actual en el footer
    const currentDate = new Date().toLocaleDateString('es-AR');
    document.getElementById('current-date').textContent = currentDate;

    // Mostrar frase aleatoria
    const quotes = [
        { text: "El único modo de hacer un gran trabajo es amar lo que haces.", class: "quote-1" },
        { text: "La innovación distingue a los líderes de los seguidores.", class: "quote-2" },
        { text: "Tu tiempo es limitado, no lo malgastes viviendo la vida de otro.", class: "quote-3" }
    ];

    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    const quoteElement = document.createElement('p');
    quoteElement.textContent = randomQuote.text;
    quoteElement.className = randomQuote.class;
    document.getElementById('random-quote').appendChild(quoteElement);

    // Manejar clicks en los links de API
    document.querySelectorAll('.api-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const apiType = this.getAttribute('data-api');
            fetchApiData(apiType);
        });
    });

    // Función para obtener datos de API
    async function fetchApiData(apiType) {
        // Ocultar contenido de inicio y mostrar contenedor de API
        document.getElementById('home-content').classList.add('hidden');
        document.getElementById('api-content').classList.remove('hidden');
        
        const apiTitle = document.getElementById('api-title');
        const apiData = document.getElementById('api-data');
        apiData.innerHTML = '<p>Cargando datos...</p>';

        try {
            switch(apiType) {
                case 'cat':
                    apiTitle.textContent = 'Imágenes aleatorias de gatos';
                    const catResponse = await fetch('https://api.thecatapi.com/v1/images/search');
                    const catData = await catResponse.json();
                    apiData.innerHTML = `<img src="${catData[0].url}" alt="Gato aleatorio" class="api-image">`;
                    break;
                    
                case 'dog':
                    apiTitle.textContent = 'Imágenes aleatorias de perros';
                    const dogResponse = await fetch('https://dog.ceo/api/breeds/image/random');
                    const dogData = await dogResponse.json();
                    apiData.innerHTML = `<img src="${dogData.message}" alt="Perro aleatorio" class="api-image">`;
                    break;
                    
                case 'joke':
                    apiTitle.textContent = 'Chiste aleatorio';
                    const jokeResponse = await fetch('https://v2.jokeapi.dev/joke/Any?lang=es');
                    const jokeData = await jokeResponse.json();
                    if (jokeData.type === 'single') {
                        apiData.innerHTML = `<div class="api-item">${jokeData.joke}</div>`;
                    } else {
                        apiData.innerHTML = `
                            <div class="api-item">
                                <p>${jokeData.setup}</p>
                                <p><strong>${jokeData.delivery}</strong></p>
                            </div>
                        `;
                    }
                    break;
            }
        } catch (error) {
            apiData.innerHTML = `<p class="error">Error al cargar los datos: ${error.message}</p>`;
        }
    }
});