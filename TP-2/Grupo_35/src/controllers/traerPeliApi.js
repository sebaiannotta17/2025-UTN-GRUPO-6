const fetchPeliculas = async (pais, setCargando, setMensaje, setPeliculas) => {
    if (!pais) {
        setMensaje("Por favor, ingrese un código de país");
        return;
    }
    
    setCargando(true);
    setMensaje('Buscando películas...');
    
    try {
        const apiKey = process.env.REACT_APP_API_KEY;
        
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

        const baseUrl = 'https://api.themoviedb.org/3/discover/movie';
        const params = new URLSearchParams({
            api_key: apiKey,
            'with_origin_country': pais.toUpperCase(),
            'primary_release_date.gte': primaryReleaseDateGte,
            'primary_release_date.lte': primaryReleaseDateLte,
        });

        const url = `${baseUrl}?${params.toString()}`;
        
        const response = await fetch(url);
        const data = await response.json();
        setPeliculas(data.results);
        setCargando(false);
        setMensaje("Películas encontradas");
        return data.results;
    } catch (error) {
        console.log('Error al obtener películas:', error);
        setMensaje("Error al obtener películas");
    } finally {
        setCargando(false);
    }
};

export default fetchPeliculas;
