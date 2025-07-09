window.onload = (e) => {
  $(document).ready(function () {
    const frases = [
      "Estoy en forma... redonda es una forma, ¿no?",
      "Estudiar no ocupa lugar... pero cómo ocupa tiempo.",
      "No tengo pereza, estoy en modo ahorro de energía."
    ];
    const fraseAleatoria = frases[Math.floor(Math.random() * frases.length)];
    $('#fraseAleatoria').html(fraseAleatoria);

    const clases = ["frase1", "frase2", "frase3"];
    const claseAleatoria = clases[Math.floor(Math.random() * clases.length)];
    $('#fraseAleatoria').addClass(claseAleatoria);
  });

  const botonVerDolar = document.querySelector("#verDolar");
  const elementoValorDolar = document.querySelector("#valorDolar");

  botonVerDolar.addEventListener("click", async () => {
    try {
      const [oficialRes, blueRes] = await Promise.all([
        fetch("https://dolarapi.com/v1/dolares/oficial"),
        fetch("https://dolarapi.com/v1/dolares/blue")
      ]);

      const oficialData = await oficialRes.json();
      const blueData = await blueRes.json();

      const fecha = new Date().toLocaleDateString("es-AR");

      const mensaje = `Cotización al ${fecha}:
- Dólar oficial: $${oficialData.venta}
- Dólar blue: $${blueData.venta}`;

      elementoValorDolar.textContent = mensaje;

    } catch (error) {
      console.error("Error al obtener la cotización:", error);
      elementoValorDolar.textContent = "No se pudo obtener la cotización del dólar.";
    }
  });
};

function getWeather() {
  $.ajax({
    url: "https://api.openweathermap.org/data/2.5/weather",
    data: {
      q: "London",
      appid: "2bca48d8b9931a4ee1a81613673f84f4",
      units: "metric"
    },
    method: "GET",
    success: function (response) {
      var temperature = response.main.temp;
      var description = response.weather[0].description;
      var weatherText = "La temperatura actual en London es de " + temperature + "°C. " + description;

      var weatherContainer = document.getElementById("weatherContainer");
      var weatherTextElement = document.createElement("p");
      weatherTextElement.textContent = weatherText;

      weatherContainer.appendChild(weatherTextElement);
    },
    error: function (error) {
      console.log("Error:", error);
    }
  });
}
