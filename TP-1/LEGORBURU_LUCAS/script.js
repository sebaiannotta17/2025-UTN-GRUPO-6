const getGifs = async (categoria) => {
    const url = `https://api.giphy.com/v1/gifs/search?api_key=85ExeWqTMAESfqOv23Q2VZ14HGifsYfl&q=${categoria}&limit=10`;
    const resp = await fetch(url);
    const { data } = await resp.json();
    return data.map(img => ({
        id: img.id,
        title: img.title,
        url: img.images.downsized_medium.url
    }));
};

const getEquipoFutbol = async(nombreEquipo) => {
    const url = `https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=${encodeURIComponent(nombreEquipo)}`;
    const resp = await fetch(url);
    const data = await resp.json();
    if (data.teams && data.teams.length > 0) {
        return data.teams[0]; 
    } else {
        return null;
    }
};

document.addEventListener("DOMContentLoaded", () => {
    const btnApi1 = document.getElementById("api1");
    const btnApi2 = document.getElementById("api2");
    const container = document.getElementById("data-container");

    const frases = [
        { texto: "Yo me equivoqué y pagué, pero la pelota no se mancha", clase: "sombra1" },
        { texto: "El éxito sin honor es un fracaso ", clase: "sombra2" },
        { texto: "El fútbol es el único amor que nunca defrauda", clase: "sombra3" }
    ];

    const mostrarFrase = () => {
        const random = Math.floor(Math.random() * frases.length);
        const fraseRandom = document.getElementById("frase-random");
        fraseRandom.textContent = frases[random].texto;
        fraseRandom.classList.add(frases[random].clase);
    };

    const cargarGifs = async (categoria) => {
        container.innerHTML = "<p>Cargando GIFs...</p>";
        const gifs = await getGifs(categoria);
        container.innerHTML = "";

        gifs.forEach(gif => {
            const gifDiv = document.createElement("div");
            gifDiv.style.marginBottom = "20px";

            gifDiv.innerHTML = `
                <h4>${gif.title}</h4>
                <img src="${gif.url}" alt="${gif.title}" style="max-width: 100%; border: 1px solid black;" />
            `;

            container.appendChild(gifDiv);
        });
    };

    const cargarEquipo = async () => {
        container.innerHTML = "<p>Cargando datos del equipo...</p>";
        const equipo = await getEquipoFutbol("Gimnasia y esgrima de la plata"); 

        if (!equipo) {
            container.innerHTML = "<p>Equipo no encontrado.</p>";
            return;
        }

        container.innerHTML = `
            <h3>${equipo.strTeam}</h3>
            <img src="${equipo.strEquipment}" alt="${equipo.strEquipment}" style="width: 150px; margin-bottom: 10px;" />
            <p><strong>Estadio:</strong> ${equipo.strStadium}</p>
            <p><strong>Fundado en:</strong> ${equipo.intFormedYear}</p>
            <p><strong>País:</strong> ${equipo.strCountry}</p>
            <img src="${equipo.strFanart1}"  style="width: 250px; margin-top: 10px;" />
            <img src="${equipo.strFanart2}"  style="width: 250px; margin-top: 10px;" />
            <img src="${equipo.strFanart3}"  style="width: 250px; margin-top: 10px;" />
            <img src="${equipo.strFanart4}"  style="width: 250px; margin-top: 10px;" />
            
        `;
    };

    btnApi1.addEventListener("click", (e) => {
        e.preventDefault();
        cargarGifs("futbol");
    });

    btnApi2.addEventListener("click", (e) => {
        e.preventDefault();
        cargarEquipo();
    });

    mostrarFrase();
});
