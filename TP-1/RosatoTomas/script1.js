$(document).ready(function() {
  const phrases = [
    { text: 'Trabajo, trabajo y más trabajo.', class: 'frase1' },
    { text: 'Tu tiempo es limitado, así que no lo desperdicies viviendo la vida de alguien más.', class: 'frase2' },
    { text: 'Lo importante es que el equipo gane', class: 'frase3' }
  ];

  const randomIndex = Math.floor(Math.random() * phrases.length);
  const selected = phrases[randomIndex];

  $('#phrase')
    .text(selected.text)
    .addClass(selected.class);

  $('#expectation').text(
    'Mi expectativa en la cátedra es profundizar mis conocimientos en tecnologías Web 2.0 y aprender a integrar APIs de manera profesional.'
  );

  $('#api1').on('click', function(e) {
    e.preventDefault();
    fetch("https://www.thecocktaildb.com/api/json/v1/1/random.php")
      .then(response => response.json())
      .then(data => {
        const drinkinfo = data.drinks[0];
        $('#content').html(`
          <div class="api-block">
            <h3>${drinkinfo.strDrink}</h3>
            <img id="fotoperro" src="${drinkinfo.strDrinkThumb}" alt="Imagen cóctel">
          </div>
        `);
      })
      .catch(error => {
        console.error('Error al obtener datos de API 1:', error);
        $('#content').html('<p class="error-msg">No se pudo cargar la información de API 1.</p>');
      });
  });
  $('#api2').on('click', function(e) {
    e.preventDefault();
    fetch("https://dog.ceo/api/breeds/image/random")
      .then(response => response.json())
      .then(data => {
        const url = data.message;
        $('#content').html(`
          <div class="api-block">
            <img id="fotoperro" src="${url}" alt="Imagen perro">
          </div>
        `);
      })
      .catch(error => {
        console.error('Error al obtener datos de API 2:', error);
        $('#content').html('<p class="error-msg">No se pudo cargar la información de API 2.</p>');
      });
  });
});
