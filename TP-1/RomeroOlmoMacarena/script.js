
 const frases = [
            "¡Voy a dominar HTML y CSS!",
            "Espero disfrutar programar sitios web.",
            "Quiero aprender a usar JavaScript con APIs."
        ];

        const sombras = ['sombra1', 'sombra2', 'sombra3'];

        const indiceFrase = Math.floor(Math.random() * frases.length);
        const indiceSombra = Math.floor(Math.random() * sombras.length);

        const fraseRandom = frases[indiceFrase];
        const sombraAleatoria = sombras[indiceSombra];

        const fraseElemento = document.getElementById("frase");
        fraseElemento.textContent = fraseRandom;
        fraseElemento.classList.add(sombraAleatoria);





function cargarAPI(api) {
  const contenido = document.getElementById("contenido");

  if (api === 'api1') {
    fetch('https://api.adviceslip.com/advice')
    .then(response => response.json())
    .then(data => {
        contenido.innerHTML = `
        <h2>Frase aleatoria</h2>
        <p class="estilo1">"${data.slip.advice}"</p>
        `;
    });


  } else if (api === 'api2') {
    fetch('https://dog.ceo/api/breeds/image/random')
      .then(response => response.json())
      .then(data => {
        contenido.innerHTML = `
          <h2>API 2: Imagen Aleatoria de Perro</h2>
          <img src="${data.message}" alt="Perro aleatorio" width="300">
        `;
      });
  }
}