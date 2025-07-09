document.addEventListener('DOMContentLoaded', function () {
  // Botón de chiste
  document.getElementById('chiste').addEventListener('click', function(e) {
    e.preventDefault();
    fetch('https://official-joke-api.appspot.com/jokes/random')
      .then(response => response.json())
      .then(data => {
        document.getElementById('contenido').innerHTML = `
          <h2>Chiste aleatorio</h2>
          <p><b>${data.setup}</b></p>
          <p>${data.punchline}</p>
        `;
      })
      .catch(error => {
        document.getElementById('contenido').innerHTML = 'Error al cargar el chiste';
        console.error(error);
      });
  });

  // Botón de imagen de perro
  document.getElementById('api2').addEventListener('click', function(e) {
    e.preventDefault();
    fetch('https://dog.ceo/api/breeds/image/random')
      .then(response => response.json())
      .then(data => {
        document.getElementById('contenido').innerHTML = `
          <h2>Imagen aleatoria de un perro</h2>
          <img src="${data.message}" alt="Perro" style="max-width: 90%; height: auto;">
        `;
      })
      .catch(error => {
        document.getElementById('contenido').innerHTML = 'Error al cargar la imagen';
        console.error(error);
      });
  });
});

