function GetApi1() {
    const palabra = document.getElementById('input-palabra').value.trim();

    if (!palabra) {
        document.getElementById('api1').innerHTML = "<p style='color:red;'>Por favor, escribí una palabra.</p>";
        return;
    }

    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${palabra}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const entry = data[0];
            let html = `
                
                <h2>📘 Definiciones de: <em>${entry.word}</em></h2>
                <p><strong>Fonética:</strong> ${entry.phonetics[0]?.text || 'No disponible'}</p>
                <audio controls src="${entry.phonetics[0]?.audio || ''}"></audio>
                <p><strong>Origen:</strong> ${entry.origin || 'No disponible'}</p>
                <h3>Significados:</h3>
                <ul>
            `;

            entry.meanings.forEach(meaning => {
                html += `
                    <li>
                        <strong>${meaning.partOfSpeech}</strong>: 
                        ${meaning.definitions[0].definition}
                        <br>
                        <em>Ejemplo:</em> "${meaning.definitions[0].example || 'No disponible'}"
                    </li>
                `;
            });

            html += "</ul>";
            document.getElementById('api1').innerHTML = html;
        })
        .catch(error => {
            console.error("Error: " + error);
            document.getElementById('api1').innerHTML = `<p style="color: red;">❌ No se encontró la palabra "${palabra}".</p>`;
        });
    document.getElementById("fraseAleatoria").textContent = "";
    document.getElementById("expectativa").style.display = "none";
}


function GetApi2() {
    const apiKey = "au5GGpDn4y7iCSr06igh6dYxYeiXkaSQo0vHCWuw";  // reemplazá con tu key real
    const fechaI = document.getElementById('input-fechaI').value.trim();
    const fechaF = document.getElementById('input-fechaF').value.trim();
    
    if (!fechaI || !fechaF) {
        document.getElementById('api1').innerHTML = "<p style='color:red;'>Por favor, ingresa ambas fechas.</p>";
        return;
    }

    $.ajax({
        url: `https://api.nasa.gov/neo/rest/v1/feed`,
        method: "GET",
        data: {
            start_date: fechaI,
            end_date: fechaF,
            api_key: apiKey
        },
        success: function(response) {
            let html = `<h2>Asteroides cercanos entre ${fechaI} y ${fechaF}</h2>`;

            const dates = Object.keys(response.near_earth_objects);
            dates.forEach(date => {
                html += `<h3>${date}</h3><ul>`;
                response.near_earth_objects[date].forEach(asteroid => {
                    html += `<li>${asteroid.name} - Velocidad: ${asteroid.close_approach_data[0].relative_velocity.kilometers_per_hour} km/h</li>`;
                });
                html += `</ul>`;
            });

            $('#api1').html(html);
        },
        error: function(error) {
            console.error(error);
            $('#api1').html("<p style='color:red;'>Error al obtener datos de asteroides.</p>");
        }
    });
    document.getElementById("fraseAleatoria").textContent = "";
    document.getElementById("expectativa").style.display = "none";
}










function GetApi3() {
    fetch("https://dog.ceo/api/breeds/image/random")
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
        document.getElementById('api1').innerHTML = `
            <h3>🐶 Imagen aleatoria de un perro</h3>
            <img src="${data.message}" alt="Perro aleatorio" width="400">
        `;
    })
    .catch(error => console.error("Error: " + error));
    document.getElementById("fraseAleatoria").textContent = "";
    document.getElementById("expectativa").style.display = "none";

}
