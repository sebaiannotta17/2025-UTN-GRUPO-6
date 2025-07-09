window.onload = function () {
  const frases = [
    "Mi avenida favorita es la 9 de Julio.",
    "Mi actor favorito es Jared Leto.",
    "Mi materia favorita es algebra 2 ahora."
  ];
  const i = Math.floor(Math.random() * frases.length);
  const fraseElement = document.getElementById("fraseRandom");
  fraseElement.className = `frase${i}`;
  fraseElement.textContent = frases[i];
};

function cargarAPI(tipo) {
  if (tipo === 'nasa') {
    const url = 'https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY';
    fetch(url)
      .then(res => res.json())
      .then(data => {
        document.getElementById('apiResult').innerHTML = `
          <h3>${data.title}</h3>
          <img src="${data.url}" width="400" alt="Imagen de la NASA">
          <p>${data.explanation}</p>
        `;
      });

  } else if (tipo === 'futurama') {
    const url = 'https://api.sampleapis.com/futurama/characters';
    fetch(url)
      .then(res => res.json())
      .then(data => {
        const random = data[Math.floor(Math.random() * data.length)];
        document.getElementById('apiResult').innerHTML = `
          <h3>${random.name.first} ${random.name.last}</h3>
          <img src="${random.images.main}" width="200">
          <p>"${random.sayings[0]}"</p>
        `;
      });
  }
}
