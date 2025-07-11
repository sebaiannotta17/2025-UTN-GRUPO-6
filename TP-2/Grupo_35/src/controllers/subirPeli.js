const subirPeli = async (peliculas, pais, apiUrl, apiToken, setSuccess) => {
    for (const pelicula of peliculas) {
        const strapiData = {
            data: {
                fechaEstreno: pelicula.release_date,
                paisOrigen: pais,
                lenguajeOrigen: pelicula.original_language,
                titulo: pelicula.title,
                imagen: pelicula.poster_path,
            }
        };
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiToken}`
                },
                body: JSON.stringify(strapiData)
            })
            if (response.ok) {
                setSuccess(true);
            }
        } catch (error) {
            console.error('Error al guardar película en Strapi:', error);
        }
    }
};

export default subirPeli;
