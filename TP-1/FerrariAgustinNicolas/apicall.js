document.addEventListener('DOMContentLoaded', () => {
    const api1Link = document.querySelector('#aside-menu a:first-child');
    const api2Link = document.querySelector('#aside-menu a:last-child');

    let pexelsPage = Math.random() * 5000;

    api1Link.addEventListener('click', async (e) => { 
        e.preventDefault();

        document.getElementById('frase1').style.display = 'none';
        document.getElementById('frase2').style.display = 'none';
        document.getElementById('frase3').style.display = 'none';
        document.getElementById('expectativa').style.display = 'none';

        const apiContainer = document.getElementById('api1');
        apiContainer.innerHTML = ''; 
        apiContainer.style.display = 'flex';
        apiContainer.style.flexDirection = 'column';
        apiContainer.style.alignItems = 'center';
        apiContainer.style.gap = '1rem';
        apiContainer.innerHTML = `<p style="text-align: center;">Cargando información de SpaceX API...</p>`;

        try {
            const response = await fetch('https://api.spacexdata.com/v4/launches');
            if (!response.ok) {
                throw new Error(`SpaceX API Error: ${response.status} ${response.statusText}`);
            }
            const launches = await response.json();

            if (launches && launches.length > 0) {
                const randomLaunch = launches[Math.floor(Math.random() * launches.length)];
                apiContainer.innerHTML = ''; 

                const title = document.createElement('h3');
                title.textContent = `SpaceX Launch: ${randomLaunch.name}`;
                title.style.textAlign = 'center';
                apiContainer.appendChild(title);

                if (randomLaunch.links && randomLaunch.links.patch && randomLaunch.links.patch.small) {
                    const img = document.createElement('img');
                    img.src = randomLaunch.links.patch.small;
                    img.alt = `Patch for ${randomLaunch.name}`;
                    img.style.maxWidth = '150px'; 
                    img.style.maxHeight = '150px';
                    img.style.height = 'auto';
                    img.style.borderRadius = '8px';
                    img.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
                    img.style.marginTop = '0.5rem';
                    apiContainer.appendChild(img);
                }

                const detailsList = document.createElement('ul');
                detailsList.style.listStyleType = 'none';
                detailsList.style.padding = '0';
                detailsList.style.marginTop = '1rem';
                detailsList.style.maxWidth = '80%';

                const createListItem = (label, value) => {
                    if (value === null || typeof value === 'undefined' || value === '') return null;
                    const item = document.createElement('li');
                    item.style.padding = '5px 0';
                    item.innerHTML = `<strong>${label}:</strong> ${value}`;
                    return item;
                };

                let listItem;

                listItem = createListItem('Vuelo número', randomLaunch.flight_number);
                if (listItem) detailsList.appendChild(listItem);

                listItem = createListItem('Fecha (UTC)', new Date(randomLaunch.date_utc).toLocaleString());
                if (listItem) detailsList.appendChild(listItem);

                listItem = createListItem('Éxito', randomLaunch.success ? 'Si' : (randomLaunch.success === false ? 'No' : 'Proximamente/Desconocido'));
                if (listItem) detailsList.appendChild(listItem);
                
                if (randomLaunch.failures && randomLaunch.failures.length > 0) {
                    listItem = createListItem('Falla', randomLaunch.failures[0].reason);
                    if (listItem) detailsList.appendChild(listItem);
                }

                if (randomLaunch.details) {
                    const detailsParagraph = document.createElement('p');
                    detailsParagraph.textContent = randomLaunch.details;
                    detailsParagraph.style.textAlign = 'justify';
                    detailsParagraph.style.marginTop = '0.5rem';
                    detailsParagraph.style.fontSize = '0.9em';
                    detailsList.appendChild(detailsParagraph); 
                }
                
                apiContainer.appendChild(detailsList);

                if (randomLaunch.links && randomLaunch.links.webcast) {
                    const webcastLink = document.createElement('a');
                    webcastLink.href = randomLaunch.links.webcast;
                    webcastLink.textContent = 'Watch Webcast';
                    webcastLink.target = '_blank';
                    webcastLink.rel = 'noopener noreferrer';
                    webcastLink.style.display = 'block';
                    webcastLink.style.textAlign = 'center';
                    webcastLink.style.marginTop = '1rem';
                    apiContainer.appendChild(webcastLink);
                }

            } else {
                apiContainer.innerHTML = `<p style="text-align: center; color: orange;">No se encontro información sobre el  lanzamiento o el formato es inesperado.</p>`;
                console.warn('SpaceX API did not return expected data:', launches);
            }

        } catch (error) {
            console.error('Error fetching SpaceX API data:', error);
            apiContainer.innerHTML = `<p style="color: red; text-align: center;">Error al cargar la información de SpaceX API: ${error.message}</p>`;
        }
    });

    api2Link.addEventListener('click', async (e) => {
        e.preventDefault();

        document.getElementById('frase1').style.display = 'none';
        document.getElementById('frase2').style.display = 'none';
        document.getElementById('frase3').style.display = 'none';
        document.getElementById('expectativa').style.display = 'none';

        const apiContainer = document.getElementById('api1');
        apiContainer.innerHTML = '';
        apiContainer.style.display = 'flex';
        apiContainer.style.flexDirection = 'column';
        apiContainer.style.alignItems = 'center';
        apiContainer.style.gap = '1rem';

        const pexelsApiKey = 'sJxtN3fHAJn0EspkWC1pNGofwRR2gMuHAT3xJS17mRGqsjg0bf31KIvB';

        const pexelsApiUrl = `https://api.pexels.com/v1/curated?page=${pexelsPage}&per_page=1`;

        try {
            const response = await fetch(pexelsApiUrl, {
                headers: {
                    'Authorization': pexelsApiKey
                }
            });

            if (!response.ok) {
                let errorMsg = `Error de Pexels API: ${response.status} ${response.statusText}.`;
                try {
                    const errorData = await response.json();
                    errorMsg += ` ${errorData.error || errorData.message || ''}`;
                } catch (jsonError) {
                                    }
                throw new Error(errorMsg);
            }

            const data = await response.json();

            if (data.photos && data.photos.length > 0) {
                const photo = data.photos[0];

                const title = document.createElement('h3');
                title.textContent = 'Imagen de Pexels';
                title.style.textAlign = 'center';
                apiContainer.appendChild(title);

                const img = document.createElement('img');
                img.src = photo.src.large;
                img.alt = photo.alt || 'Imagen de Pexels';
                img.style.maxWidth = '90%';
                img.style.maxHeight = '60vh';
                img.style.height = 'auto';
                img.style.borderRadius = '8px';
                img.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
                apiContainer.appendChild(img);

                const photographerInfo = document.createElement('p');
                photographerInfo.style.textAlign = 'center';
                photographerInfo.style.fontSize = '0.9em';
                photographerInfo.style.marginTop = '0.5rem';
                photographerInfo.innerHTML = `Fotógrafo: <a href="${photo.photographer_url}" target="_blank" rel="noopener noreferrer">${photo.photographer}</a>`;
                apiContainer.appendChild(photographerInfo);

                pexelsPage++;
                if (pexelsPage > 5000) {
                    pexelsPage = 1;
                }

            } else {
                apiContainer.innerHTML = '<p style="text-align: center;">No se encontraron imágenes de Pexels o la respuesta está vacía.</p>';
                console.warn('Pexels API no devolvió fotos para la página:', pexelsPage, data);
                                pexelsPage = 1;
            }

        } catch (error) {
            console.error('Error al obtener datos de Pexels API:', error);
            apiContainer.innerHTML = `<p style="color: red; text-align: center;">Error al cargar imagen de Pexels: ${error.message}</p>`;
        }
    });
});
