const getFighterByName = async (name) => {
    const response = await fetch(`https://v1.mma.api-sports.io/fighters?search=${name}`, {
        method: "GET",
        headers: {
            "x-rapidapi-host": "v1.mma.api-sports.io",
            "x-rapidapi-key": "8c2f1fcc65873b074c9e1c8a57799866"
        }
    })
    console.log(response);
    return response.json();
}

const getLastFights = async (fighterId) => {
    const response = await fetch(`https://v1.mma.api-sports.io/fighters/${fighterId}/fights?last=10`, {
        method: "GET",
        headers: {
            "x-rapidapi-host": "v1.mma.api-sports.io",
            "x-rapidapi-key": "8c2f1fcc65873b074c9e1c8a57799866"
        }
    })
    return response.json();
}

const getFighterLastFights = async (name) => {
    try {
        const fighterData = await getFighterByName(name);
        console.log(fighterData);
        if (!fighterData.response || fighterData.response.length === 0) {
            throw new Error('No se encontró el peleador');
        }

        const fighterId = fighterData.response[0].id;
        
        const fightsData = await getLastFights(fighterId);
        
        return {
            fighter: fighterData.response[0],
            fights: fightsData.response
        };
    } catch (error) {
        console.error('Error al obtener los datos:', error);
        throw error;
    }
}

window.getFighterByName = getFighterByName;
window.getLastFights = getLastFights;
window.getFighterLastFights = getFighterLastFights;
