document.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById('logo-button');
  const logo = document.getElementById('logo');
  const logoContainer = document.getElementById('logo-container'); 
  const parrafo = document.getElementById('texto-expectativa');
  const linkClima = document.getElementById('link-clima');
  const linkHora = document.getElementById('link-hora');
  const informacion = document.getElementById('informacion');
  const botonReiniciar = document.getElementById('reiniciar-btn');

  botonReiniciar.addEventListener('click', () => {
    location.reload();
  });



  const textos = [
    "Universidad Tecnológica Nacional.",
    "Tecnología y Gestión Web.",
    "HTML-CSS-JavaScript.",
    "Espero aprender a utilizar correctamente APIs, mejorar mis habilidades en desarrollo frontend."
  ];

  function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  function getRandomFont() {
    const fonts = ['Arial', 'Verdana', 'Times New Roman', 'Georgia', 'Courier New', 'Tahoma'];
    return fonts[Math.floor(Math.random() * fonts.length)];
  }

  button.addEventListener('click', () => {
    const randomText = textos[Math.floor(Math.random() * textos.length)];
    parrafo.textContent = randomText;
    parrafo.style.color = getRandomColor();
    parrafo.style.fontFamily = getRandomFont();
  });

  // Clima con Open-Meteo (sin API key)
  linkClima.addEventListener('click', (e) => {
    e.preventDefault();
    informacion.textContent = "Cargando clima...";
    fetch("https://api.open-meteo.com/v1/forecast?latitude=-34.61&longitude=-58.38&current_weather=true")
      .then(res => res.json())
      .then(data => {
        const temp = data.current_weather.temperature;
        const wind = data.current_weather.windspeed;
        informacion.textContent = `🌡 Temperatura en Buenos Aires: ${temp}°C | 🌬 Viento: ${wind} km/h`;
      })
      .catch(() => {
        informacion.textContent = "⚠️ Error al obtener el clima. Intenta más tarde.";
      });
  });

  const linkCripto = document.getElementById('link-cripto');

  linkCripto.addEventListener('click', (e) => {
    e.preventDefault();
    informacion.textContent = "Cargando precio de Bitcoin...";
  
    fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd,ars')
      .then(res => res.json())
      .then(data => {
        const precioUSD = data.bitcoin.usd;
        const precioARS = data.bitcoin.ars;
        informacion.textContent = `💰 Precio de Bitcoin: USD $${precioUSD} | ARS $${precioARS}`;
      })
      .catch(() => {
        informacion.textContent = "⚠️ No se pudo obtener el precio.";
      });
  });
  
});