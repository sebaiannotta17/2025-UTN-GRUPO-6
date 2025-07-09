document.addEventListener('DOMContentLoaded', () => {
  const frases = [
    { texto: 'Ser primero no es lo importante, es lo único. ¿Vos te acordás quién pisó América después de Colón? Yo no..[BILARDO]', clase: 'sombra1' },
    { texto: 'La pelota no se mancha.[DIEGO MARADONA]', clase: 'sombra2' },
    { texto: 'Si se cree y se trabaja, se puede[DIEGO SIMEONE].', clase: 'sombra3' }
  ];

  const random = Math.floor(Math.random() * frases.length);
  const frase = frases[random];

  const fraseElem = document.getElementById('frase');
  fraseElem.textContent = frase.texto;
  fraseElem.classList.add(frase.clase);
});

function cargarAPI(api) {
  const contenido = document.getElementById('contenidoAPI');
  contenido.innerHTML = `<p>Cargando datos de ${api}...</p>`;

  if (api === 'api1') {
    const API_KEY = '04c258679bd53a175f28d5e432d07577';
    const ciudad = 'La Plata,AR';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${API_KEY}&units=metric&lang=es`;

    fetch(url)
      .then(response => {
        if (!response.ok) throw new Error("No se pudo obtener el clima! Intente mas tarde... :) "); //error del responce
        return response.json();
      })
      .then(data => {
        const temp = data.main.temp;
        const descripcion = data.weather[0].description;
        contenido.innerHTML = `
          <p><strong>Clima en La Plata:</strong></p>
          <p>Temperatura: ${temp}°C</p>
          <p>Condición del tiempo: ${descripcion}</p>
        `;
      })
      .catch(error => {
        contenido.innerHTML = '<p>Error al obtener el clima :O .</p>';   //error del clima pero se muestra el codigo en html
        console.error(error);
      });
      
  } else if (api === 'api2') {
    contenido.innerHTML = `
      <div id="inputContainer" style="text-align:center;">
        <input type="text" id="codigoInput" placeholder="Ingresa el código HTTP" style="padding: 5px; font-size: 1rem;">
        <button onclick="mostrarImagenInput()" style="padding: 5px 10px; font-size: 1rem;">Mostrar imagen</button>
      </div>
    `;
  }
}

function mostrarImagenInput() {
  const codigo = document.getElementById('codigoInput').value.trim();
  console.log("Código ingresado:", codigo);
  if (codigo) {
    mostrarImagenHttpDog(codigo);
  } else {
    alert("Por favor, ingresa un código HTTP válido.");
  }
}


const mostrarImagenHttpDog = (codigo) => {
  const contenido = document.getElementById('contenidoAPI');
  contenido.innerHTML = `<p>Cargando imagen...</p>`;
  const url = `https://http.dog/${codigo}.jpg`;     // aca iria el codigo que se ingresa por input, y se lo manda a la url
  fetch(url)
    .then(response => {
      if (!response.ok) throw new Error('Imagen no encontrada');    //img no encuentra
      return response.blob();
    })
    .then(blob => {
      const objectURL = URL.createObjectURL(blob);
      contenido.innerHTML = `<img src="${objectURL}" alt="HTTP Dog ${codigo}" style="max-width: 400px; width: 100%; height: auto; display: block; margin: 0 auto;">`;
    })
    .catch(error => {                                               //codigo en html para mostrar el error de img
      console.error("Error:", error);
      contenido.innerHTML = `<br><p>Error al cargar la imagen :(((</p>           
                            <br><p> Tu error no tiene meme, prueba con otro!`;
    });
};
