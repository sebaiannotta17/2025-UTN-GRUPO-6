// ⚽ API: Usando API-Football (api-football.com)
function cargarAPI1() {
    fetch("https://v3.football.api-sports.io/teams?search=Boca Juniors", {
        method: "GET",
        headers: {
            "x-apisports-key": "f9b2f4e1ed5b42445ebfdcd7ce5b7a84"
        }
    })
    .then(response => {
        if (!response.ok) throw new Error("Error al obtener datos de la API-Football");
        return response.json();
    })
    .then(data => {
        const equipo = data.response[0];
        const estadio = equipo.venue.name;
        const ciudad = equipo.venue.city;
        const capacidad = equipo.venue.capacity;
        const direccion = equipo.venue.address;

        const imagenesEstadios = {
            "La Bombonera": "bombonera.jpg"
        };

        const imagenEstadio = imagenesEstadios[estadio] || "bombonera.jpg";

        document.getElementById("main").innerHTML = `
            <h2>Estadio: ${estadio}</h2>
            <img src="${imagenEstadio}" alt="Estadio ${estadio}" style="max-width:40%; border-radius:10px; margin-top:10px;">
            <p><strong>Ciudad:</strong> ${ciudad}</p>
            <p><strong>Capacidad:</strong> ${capacidad}</p>
            <p><strong>Dirección:</strong> ${direccion}</p>
        `;
    })
    .catch(error => {
        document.getElementById("main").innerHTML = `<p style="color:red;">Error cargando API 1: ${error.message}</p>`;
    });
}


function cargarAPI2() {
    fetch("https://pokeapi.co/api/v2/pokemon/pikachu")
        .then(response => {
            if (!response.ok) throw new Error("Error al obtener datos de la PokéAPI");
            return response.json();
        })
        .then(data => {
            const nombre = data.name.charAt(0).toUpperCase() + data.name.slice(1);
            const tipos = data.types.map(t => t.type.name).join(", ");
            const habilidades = data.abilities.map(a => a.ability.name).join(", ");
            const altura = data.height / 10; // metros
            const peso = data.weight / 10;  // kilogramos

            const imagenPersonalizada = "pikachu.jpeg"; 

            document.getElementById("main").innerHTML = `
                <h2>Pokémon: ${nombre}</h2>
                <img src="${imagenPersonalizada}" alt="Pikachu con camiseta de Boca" style="max-width:250px; border-radius:10px; margin-top:10px;">
                <p><strong>Tipo(s):</strong> ${tipos}</p>
                <p><strong>Habilidad(es):</strong> ${habilidades}</p>
                <p><strong>Altura:</strong> ${altura} m</p>
                <p><strong>Peso:</strong> ${peso} kg</p>
            `;
        })
        .catch(error => {
            document.getElementById("main").innerHTML = `<p style="color:red;">Error cargando API 2: ${error.message}</p>`;
        });
}




window.onload = function () {
    const frases = ["frase1", "frase2", "frase3"];
    
    const seleccionada = frases[Math.floor(Math.random() * frases.length)];
    
    frases.forEach(id => {
        document.getElementById(id).style.display = "none";
    });

    document.getElementById(seleccionada).style.display = "block";
};
