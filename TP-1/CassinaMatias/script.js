const frases = [
  {
    texto: '"En algún lugar, algo increíble está esperando ser descubierto." - Carl Sagan',
    class: 'sombra1'
  },
  {
    texto: '"Miro hacia las estrellas, no hacia mis pies." - Stephen Hawking',
    class: 'sombra2'
  },
  {
    texto: '"La exploración está codificada en nuestro cerebro. Si vemos el horizonte, queremos saber qué hay más allá." - Buzz Aldrin',
    class: 'sombra3'
  }
];

function mostrarFraseAleatoria() {
  const fraseDiv = document.getElementById('frase-elegida');

  const index = Math.floor(Math.random() * frases.length);
  const frase = frases[index];

  fraseDiv.className = `frase-completa ${frase.class}`;
  fraseDiv.textContent = frase.texto;
}

window.addEventListener('DOMContentLoaded', mostrarFraseAleatoria);

function ConsumirAPI(tipo) {
  const mostrar = document.getElementById("mostrar-api");
  const apiKey = "DEMO_KEY";

  if (tipo === "apod") {
    fetch(`https://api.nasa.gov/planetary/apod?api_key=${apiKey}`)
      .then(response => response.json())
      .then(data => {
        mostrar.innerHTML = `
          <h3>${data.title}</h3>
          <img src="${data.url}" alt="${data.title}" style="max-width:100%; border-radius:10px;" />
          <p>${data.explanation}</p>
        `;
      })
      .catch(() => {
        mostrar.innerHTML = "Error al cargar la imagen del universo.";
      });

  } else if (tipo === "mars") {
    fetch(`https://api.nasa.gov/insight_weather/?api_key=${apiKey}&feedtype=json&ver=1.0`)
      .then(response => response.json())
      .then(data => {
        const sol = data.sol_keys?.[data.sol_keys.length - 1];
        const info = data[sol];
        mostrar.innerHTML = `
          <h3>Clima en Marte - Sol ${sol}</h3>
          <p>Temp. mínima: ${info.AT?.mn ?? 'N/A'}°C</p>
          <p>Temp. máxima: ${info.AT?.mx ?? 'N/A'}°C</p>
          <p>Viento promedio: ${info.HWS?.av ?? 'N/A'} m/s</p>
        `;
      })
      .catch(() => {
        mostrar.innerHTML = "Error al obtener el clima de Marte.";
      });

  } else {
    mostrar.innerHTML = "API desconocida.";
  }
}