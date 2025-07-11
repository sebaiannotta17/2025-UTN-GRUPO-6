const traerPeliStrapi = async (apiUrl, apiToken, setMovies, pais) => {
    try {
        const today = new Date();
        const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());

        const formatDate = (date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };

        const primaryReleaseDateGte = formatDate(lastMonth);
        const primaryReleaseDateLte = formatDate(today);

        const filterUrl = `${apiUrl}?filters[paisOrigen][$eq]=${pais.toUpperCase()}&filters[fechaEstreno][$gte]=${primaryReleaseDateGte}&filters[fechaEstreno][$lte]=${primaryReleaseDateLte}`;
        const response = await fetch(filterUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiToken}`
            },
        });
        const responseData = await response.json();
        const peliculasUnicas = responseData.data.filter((pelicula, index, self) => 
            index === self.findIndex(p => p.titulo === pelicula.titulo)
        );
        
        setMovies(peliculasUnicas);
    } catch (error) {
        console.error('Error al obtener películas de Strapi:', error);
    }
};

export default traerPeliStrapi;
