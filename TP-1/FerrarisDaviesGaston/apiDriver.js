const getRandomDriver = async () => {
    try {
        const randomId = Math.floor(Math.random() * 110);
        
        const response = await fetch(`https://v1.formula-1.api-sports.io/drivers?id=${randomId}`, {
            method: "GET",
            headers: {
                "x-rapidapi-host": "v1.formula-1.api-sports.io",
                "x-rapidapi-key": "8c2f1fcc65873b074c9e1c8a57799866"
            }
        });
        
        const data = await response.json();
        console.log('Datos del piloto:', data.response[0]);
        
        if (!data.response || data.response.length === 0) {
            throw new Error('No se encontró un piloto con ese ID. Por favor, intente nuevamente.');
        }

        return data.response[0];
    } catch (error) {
        console.error('Error al obtener el piloto:', error);
        throw error;
    }
}

window.getRandomDriver = getRandomDriver;

