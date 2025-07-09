$(document).ready(function () {
  //Funcion para borrar el contenido actual de la seccion principal
  function limpiarContenidoPrincipal() {
    $('.content').empty();
  }

  // ---------------------------------------- Mostrar frase random ----------------------------------------
  // Defino un array de objetos con las frases y sus respectivas clases (las cuales tienen sus estilos CSS propios)
  var frases = [
    { frase: "Vivir y jugar con grandeza", claseF: "primera" },
    { frase: "Mente sana en cuerpo sano", claseF: "segunda" },
    { frase: "Si entre hermanos se <span id='amarillo'>pelean los</span> devoran los de afuera", claseF: "tercera" }
  ];
  // Math.random() * 3 genera un número entre 0 y 3 (menor que 3)
  // Math.floor() redondea hacia abajo el número random generado
  var numRandom = Math.floor(Math.random() * 3);
  // Selecciono una frase del array de frases utilizando como índice el número random generado
  var fraseRandom = frases[numRandom];
  // Muestro la frase seleccionada en mi codigo HTML (en el elemento de id="frase" ) y le agrego su clase correspondiente para que tenga su estilo de CSS
  $('#frase').html(fraseRandom.frase).addClass(fraseRandom.claseF);
  // ---------------------------------------- Fin Mostrar frase random ----------------------------------------


  // ---------------------------------------- Mostrar partidos de playoffs de la NBA (API 1) --------------------------------------
  $("#firstBtn").click(function (){
    var year = $("#year").val();
    if (!year) {
      alert("Ingresá un año");
      return;
    }
    if (isNaN(year) || (year < 1950 || year > 2024)) {
      alert("Ingresá un año válido (1950-2024).");
      return;
    }
    limpiarContenidoPrincipal();

    $.ajax({
      url: 'https://api.balldontlie.io/v1/games',
      method: 'GET',
      headers:{
        'Authorization': 'Bearer 0c585931-1362-410f-954d-2f4efe83ecfe'
      },
      data:{
        'seasons': [year],
        'postseason': true
      },
      success: function (response) {
        const partidos = response.data;

        partidos.forEach(function (partido) {
          // Creo un contenedor para cada partido
          const game = $('<div class="partido"></div>');

          const fecha = new Date(partido.date).toLocaleDateString();

          game.append(`<p id="date">${fecha}</p>`);
          const score = $('<div class="score"></div>');
          score.append(`<p>${partido.home_team.full_name} - <strong>${partido.home_team_score}</strong></p>`);
          score.append(`<p><strong>${partido.visitor_team_score}</strong> - ${partido.visitor_team.full_name}</p>`);
          game.append(score);

          // Agrego el elemento html del partido a la sección principal
          $('.content').append(game);
        });
      },
      error: function (req, status, err) {
        console.log(req, status, err);
      }
    });
  });
  // ---------------------------------------- Fin Mostrar partidos de playoffs de la NBA (API 1) --------------------------------------

  // ---------------------------------------- Mostrar últimas noticias de tecnología de Argentina (API 2) --------------------------------------
  $("#secBtn").click(function(){
    limpiarContenidoPrincipal();
    $.ajax({
      url:'https://newsdata.io/api/1/news',
      method: 'GET',
      data: {
        apikey: "pub_86827b2d2eedab96d51d88ff7fd623dc414b4",
        country: "ar",
        category: "technology",
        language: "es"
      },
      success: function (response) {
        const noticias = response.results;
        // Creo un contenedor para las noticias
        const container = $('<div class="noticias-container"></div>');

        noticias.forEach(function(noticia){
          //creo un contenedor para cada noticia
          const noti = $('<div class="noticia"></div>');

          noti.append(`<h3>${noticia.title}</h3>`);
          noti.append(`<img src="${noticia.image_url}" alt="Imagen de la noticia" class="noticia-img">`);
          noti.append(`<p><a href="${noticia.link}" target="_blank">Leer más</a></p>`);
          
          container.append(noti);
        });

        // Agrego el contenedor de noticias a la sección principal
        $('.content').append(container);
      },
      error: function (req, status, err) {
        console.log(req, status, err);
      }
    });
  });
  // ----------------------------------------  Fin Mostrar últimas noticias de tecnología de Argentina (API 2) --------------------------------------
});