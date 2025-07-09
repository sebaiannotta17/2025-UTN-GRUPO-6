document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('fighter-search');
    const searchButton = document.getElementById('search-button');
    const fighterInfo = document.getElementById('fighter-info');
    const loading = document.getElementById('loading');
    const errorMessage = document.getElementById('error-message');

    searchButton.addEventListener('click', async () => {
        const fighterName = searchInput.value.trim();
        if (!fighterName) {
            errorMessage.textContent = 'Por favor, ingrese un nombre de peleador';
            return;
        }

        try {
            loading.style.display = 'block';
            fighterInfo.style.display = 'none';
            errorMessage.textContent = '';

            const result = await getFighterByName(fighterName);
            
            if (!result.response || result.response.length === 0) {
                throw new Error('No se encontró el peleador');
            }

            const fighter = result.response[0];
            
            document.getElementById('fighter-name').textContent = fighter.name;
            document.getElementById('fighter-nickname').textContent = `"${fighter.nickname}"`;
            document.getElementById('fighter-category').textContent = fighter.category;
            document.getElementById('fighter-image').src = fighter.photo || '../publi/default-fighter.jpg';
            document.getElementById('fighter-weight').textContent = `${fighter.weight} kg`;
            document.getElementById('fighter-height').textContent = `${fighter.height} cm`;

            fighterInfo.style.display = 'block';
        } catch (error) {
            errorMessage.textContent = error.message || 'Error al buscar el peleador';
        } finally {
            loading.style.display = 'none';
        }
    });

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchButton.click();
        }
    });
}); 