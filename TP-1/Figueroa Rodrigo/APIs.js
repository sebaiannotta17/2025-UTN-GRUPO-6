/*API de OpenWeather, usada en este caso para consultar el clima en La Plata*/
function getClima() {
    const apiKey = "45388ff5404d70d2f11acdbf0be0c1f8";
    const ciudad = "La Plata";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${apiKey}&units=metric&lang=es`;

    $.ajax({
        url: url,
        type: "GET",
        dataType: "json",
        success: function(data) {
            $("#contenidoPrincipal").html(`
                <p>El clima en ${data.name} es de ${data.main.temp}°C con ${data.weather[0].description}. 
                La humedad actual es del ${data.main.humidity}%.</p>
            `);
        },
        error: function(error) {
            console.error("Error al obtener el clima:", error);
            $("#contenidoPrincipal").html(`<p>Error al obtener los datos del clima.</p>`);
        }
    });
}
/*API de SpaceX, usada en este caso para consultar información sobre el último lanzamiento*/
function getLaunchData() {
    const url = "https://api.spacexdata.com/v5/launches/latest";

    $.ajax({
        url: url,
        type: "GET",
        dataType: "json",
        success: function(data) {
            $("#contenidoPrincipal").html(`
                <p><strong>Misión:</strong> ${data.name}</p>
                <p><strong>Fecha de lanzamiento:</strong> ${new Date(data.date_utc).toLocaleString()}</p>
                <p><strong>Estado:</strong> ${data.success ? "Éxito" : "Fallo"}</p>
                <p><strong>Detalles:</strong> ${data.details || "Sin información adicional"}</p>
                <p><strong>Ver en YouTube:</strong> <a href="${data.links.webcast}" target="_blank">Transmisión</a></p>
            `);
        },
        error: function(error) {
            console.error("Error al obtener los datos:", error);
            $("#contenidoPrincipal").html(`<p>Error al obtener la información del lanzamiento.</p>`);
        }
    });
}