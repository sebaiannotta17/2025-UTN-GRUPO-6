document.addEventListener('DOMContentLoaded', function() {
    //Cargo la lista de frases aleatorias, en este caso son de Steve Jobs
    const frases = [
        "La innovación es lo que distingue a un líder de los demás.",
        "Tu tiempo es limitado, así que no lo desperdicies viviendo la vida de otra persona.",
        "La única manera de hacer un gran trabajo es amar lo que haces."
    ];
    // Selecciono un contenedor (En el index esta freseMostrada) para mostrar una frase aleatoria
    const fraseContenedor = document.getElementById('fraseMostrada');
    if (fraseContenedor) {
        fraseContenedor.textContent = frases[Math.floor(Math.random() * frases.length)]; // Selecciono una frase aleatoria
        fraseContenedor.className = 'frase-aleatoria'; // Le asigno una clase para darle estilo
    }

    const apiLinks = document.querySelectorAll('aside nav ul li a'); // Selecciono todos los enlaces de las APIs
    const apiContentDiv = document.getElementById('api-content'); // Seleccion el div donde se va a estar mostranndo el contendio de la API
    const prevArrow = document.getElementById('prevArrow'); // Selecciono la flecha de "anterior"
    const nextArrow = document.getElementById('nextArrow'); // Selecciono la flecha de "siguiente"
    const logoLink = document.getElementById('logoLinkReset'); // Selecciono el enlace del logo para resetear la vista

    // Variables para manejar el estado de la vista de las APIs
    let isFirstApiClickOverall = true;
    let currentDataList = [];
    let currentIndex = -1;
    let currentActiveApiId = null;

    // Resetea la vista de las APIs al inicio
    function resetApiView() {
        if (apiContentDiv) {
            apiContentDiv.innerHTML = `<p><em>Selecciona una API del menú lateral para ver su información aquí.</em></p>`;
        }
        // Oculta las flechas de navegación cuando no hay contenido
        if (prevArrow) prevArrow.style.display = 'none';
        if (nextArrow) nextArrow.style.display = 'none'; 
        currentDataList = [];
        currentIndex = -1;
        currentActiveApiId = null;
        isFirstApiClickOverall = true;
    }

    // Verifica que los elementos esenciales existan antes de agregar eventos
    if (!apiContentDiv || !prevArrow || !nextArrow) {
        console.error("Elementos esenciales (#api-content, flechas) no encontrados.");
    } else {
        resetApiView();
    }

    // Agrega el evento de clic al logo para resetear la vista
    if (logoLink) {
        logoLink.addEventListener('click', function(event) {
            event.preventDefault();
            resetApiView();
        });
    }
    
    if (apiLinks.length > 0 && apiContentDiv) { // Verifica que haya enlaces de API
        apiLinks.forEach(link => {
            link.addEventListener('click', function(event) {
                event.preventDefault();
                const apiId = this.id;
                const apiName = this.textContent;
                if (currentActiveApiId !== apiId) { // Si se hace clic en una API diferente, se resetea el contenido previo y las variables de estado
                    currentDataList = [];
                    currentIndex = -1;
                }
                currentActiveApiId = apiId;
                if (isFirstApiClickOverall || currentDataList.length === 0) { // Si es la primera vez que se hace clic en una API o no hay datos previos
                    apiContentDiv.innerHTML = `<p><em>Cargando datos de <strong>${apiName}</strong>...</em></p>`;
                    if (isFirstApiClickOverall) isFirstApiClickOverall = false;
                }
                fetchApiDataAndDisplay(apiId, apiName, apiContentDiv, true);
            });
        });
    } else { // Si no hay enlaces de API, muestra un mensaje de advertencia
        console.warn("No se encontraron links de API.");
    }

    prevArrow.addEventListener('click', () => { // Maneja el clic en la flecha de "anterior"
        if (currentIndex > 0) {
            currentIndex--;
            displayCurrentPostcard(apiContentDiv);
        }
    });

    nextArrow.addEventListener('click', () => { // Maneja el clic en la flecha de "siguiente"
        if (currentIndex < currentDataList.length - 1) {
            currentIndex++;
            displayCurrentPostcard(apiContentDiv);
        } else {
            const apiName = document.getElementById(currentActiveApiId)?.textContent || "Siguiente Postal";
            if (currentActiveApiId) { // Si hay una API activa, intenta cargar un nuevo item
                apiContentDiv.innerHTML = `<p><em>Cargando siguiente ${currentActiveApiId === 'apiComidas' ? 'postal de comida' : 'postal de ciudad'}...</em></p>`;
                fetchApiDataAndDisplay(currentActiveApiId, apiName, apiContentDiv, true);
            }
        }
    });

    function updateArrowVisibility() { // Actualiza la visibilidad de las flechas de navegación
        if (!prevArrow || !nextArrow || !apiContentDiv) return;
        const hasPostcardContent = apiContentDiv.querySelector('div.postcard'); 
        if (currentDataList.length > 0 && currentIndex !== -1 && hasPostcardContent) {
            prevArrow.style.display = 'flex';
            nextArrow.style.display = 'flex';
            prevArrow.disabled = (currentIndex <= 0);
            nextArrow.disabled = false;
        } else {
            prevArrow.style.display = 'none';
            nextArrow.style.display = 'none';
        }
    }

    function displayCurrentPostcard(contentDiv) { // Muestra la postal actual en el div de contenido
        if (currentIndex >= 0 && currentIndex < currentDataList.length) {
            const dataItem = currentDataList[currentIndex];
            let postcardHTML = buildPostcardHTML(dataItem, currentActiveApiId);
            if (contentDiv) contentDiv.innerHTML = postcardHTML;
        }
        updateArrowVisibility(); 
    }

    async function fetchApiDataAndDisplay(apiId, apiName, contentDiv, fetchNewItem = false) { // Función para obtener datos de la API y mostrar la postal
        let url = '';
        let newItemData = null;
        try {
            if (fetchNewItem) {
                if (apiId === 'apiCiudades') { // API de Maravillas del Mundo
                    url = 'https://www.world-wonders-api.org/v0/wonders/random';
                    const wondersResponse = await fetch(url);
                    if (!wondersResponse.ok) throw new Error(`Error HTTP Maravillas (random): ${wondersResponse.status} - ${wondersResponse.statusText}`);
                    newItemData = await wondersResponse.json();
                    if (!newItemData || typeof newItemData !== 'object' || Array.isArray(newItemData)) {
                        throw new Error("Respuesta inesperada de API /wonders/random. Se esperaba un objeto maravilla único.");
                    }
                } else if (apiId === 'apiComidas') { // API de Comidas
                    url = 'https://www.themealdb.com/api/json/v1/1/random.php';
                    const foodResponse = await fetch(url);
                    if (!foodResponse.ok) throw new Error(`Error HTTP Comida: ${foodResponse.status} - ${foodResponse.statusText}`);
                    const foodData = await foodResponse.json();
                    if (foodData.meals && foodData.meals.length > 0) {
                        newItemData = foodData.meals[0];
                    } else {
                        throw new Error("No se encontró información de comida.");
                    }
                } else { // Si no se reconoce el ID de la API, lanza un error
                    if (contentDiv) contentDiv.innerHTML = `<h3>${apiName}:</h3><p>La API con ID "${apiId}" no está configurada.</p>`;
                    updateArrowVisibility();
                    return;
                }
                if (newItemData) { // Si se obtuvo un nuevo item, lo agrega a la lista actual
                    currentDataList.push(newItemData);
                    currentIndex = currentDataList.length - 1;
                } else { // Si no se obtuvo un nuevo item, lanza un error
                    throw new Error(`No se pudo obtener un nuevo item para ${apiName}.`);
                }
            } else if (currentIndex === -1 && currentDataList.length > 0) { // Si no se está obteniendo un nuevo item, pero ya hay datos previos, reinicia el índice
                currentIndex = 0;
            }
            if (currentDataList.length > 0 && currentIndex >= 0 && currentIndex < currentDataList.length) { // Si hay datos en la lista actual, muestra la postal
                displayCurrentPostcard(contentDiv);
            } else { // Si no hay datos en la lista actual, muestra un mensaje de error
                if (contentDiv && fetchNewItem) {
                    contentDiv.innerHTML = `<p>No se pudo cargar contenido para ${apiName}.</p>`;
                } else if (contentDiv && currentDataList.length === 0) {
                    contentDiv.innerHTML = `<p><em>Selecciona una API o presiona 'Siguiente' para cargar contenido.</em></p>`;
                }
                updateArrowVisibility();
            }
        } catch (error) { // Maneja errores de red o de la API
            let errorDisplay = `<h3>Error al cargar: ${apiName}</h3>`;
            errorDisplay += `<p>Lo sentimos...</p><p><i>Detalle técnico: ${error.message}.</i></p>`;
            if (contentDiv) contentDiv.innerHTML = errorDisplay;
            updateArrowVisibility(); 
        }
    }

    function buildPostcardHTML(itemData, apiId) { // Construye el HTML de la postal 
        let postcardData = {
            title: "No disponible",
            imageUrl: 'images/placeholder_general.jpg',
            subtitleOrLinkHTML: "",
            description: "No disponible."
        };
        if (itemData) {
            if (apiId === 'apiCiudades') { // API de Maravillas del Mundo
                postcardData.title = itemData.name || "Maravilla"; 
                const wiki = (itemData.links && itemData.links.wiki); // Verifica si hay un enlace a Wikipedia
                if (itemData.image_url) {
                    postcardData.imageUrl = itemData.image_url; // Usa la imagen de la maravilla si está disponible
                } else if (itemData.links && itemData.links.images && itemData.links.images.length > 0) { // Verifica si hay imágenes disponibles
                    postcardData.imageUrl = itemData.links.images[0];
                } else {
                    postcardData.imageUrl = 'images/placeholder_general.jpg';
                }
                postcardData.subtitleOrLinkHTML = `<a href="${wiki}" target="_blank" rel="noopener noreferrer" class="postcard-subtitle-link"><em>${itemData.location}</em></a>`;
                postcardData.description = itemData.summary || "";
            } else if (apiId === 'apiComidas') { // API de Comidas
                postcardData.title = itemData.strMeal || "Plato";
                postcardData.imageUrl = itemData.strMealThumb || 'images/placeholder_general.jpg'; 
                const foodArea = itemData.strArea || "";
                const recipeSourceLink = itemData.strSource || itemData.strYoutube;
                postcardData.description = itemData.strCategory ? `Categoría: ${itemData.strCategory}` : "";
                if (recipeSourceLink) { // Si hay un enlace a la receta o video, lo agrega como enlace
                    postcardData.subtitleOrLinkHTML = `<a href="${recipeSourceLink}" target="_blank" rel="noopener noreferrer" class="postcard-subtitle-link">Ver Receta</a> <span class="postcard-subtitle-nolink">Origen: ${foodArea}</span>`;
                } else {
                    postcardData.subtitleOrLinkHTML = `<p class="postcard-subtitle-nolink">Origen: ${foodArea}</p>`;
                }
            }
        } else { // Si no hay datos del item, muestra un mensaje de error
            return `<p>Error: Datos del item no válidos.</p>`;
        }
        return `
            <div class="postcard">
                <div class="postcard-image-area"><img src="${postcardData.imageUrl}" alt="${postcardData.title}" onerror="this.src='images/placeholder_general.jpg'; this.alt='Imagen no disponible';"></div>
                <div class="postcard-text-area">
                    <div class="postcard-internal-stamp"></div>
                    <h3 class="postcard-title">${postcardData.title}</h3>
                    ${postcardData.subtitleOrLinkHTML}
                    <p class="postcard-description">${postcardData.description}</p>
                    <div class="postcard-decorations">
                        <div class="postcard-address-lines">
                            <span></span><span></span><span></span><span></span>
                        </div>
                    </div>
                </div>
            </div>`;
    }
    updateArrowVisibility(); // Asegura que las flechas de navegación se actualicen al cargar la página
}); 
