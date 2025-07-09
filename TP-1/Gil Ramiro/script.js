//Frase aleatoria:
var arrayFrases = [
  {frase: "Mantente hambriento, mantente alocado. Steve Jobs" , clase: "primera" },
  {frase: "Hablar es fácil. Muéstrame el código. Linus Torvalds", clase: "segunda" },
  {frase: "Está bien celebrar el éxito, pero es más importante prestar atención a las lecciones del fracaso.  Bill Gates", clase: "tercera" }
];

tamanio_array = arrayFrases.length;

numero_aleatorio = Math.floor(Math.random() * tamanio_array);

var frase_aleatoria = arrayFrases[numero_aleatorio];

$('#frase').text(frase_aleatoria.frase).addClass(frase_aleatoria.autor).addClass(frase_aleatoria.clase);


//Obtener resultados de los Lakers:
function GetResultados() {
    fetch('https://api.balldontlie.io/v1/games?team_ids[]=14&seasons[]=2024&per_page=110', {
        headers: {
          'Authorization': '0f1b3bcb-dae9-48ce-bb68-f1a42ff5f67d'
        }
      })
        .then(response => response.json())
        .then(data => {
          console.log(data);
          var games = data.data;
          var all_games = document.getElementById('all_games');
          
          text.innerHTML = '';
          all_films.innerHTML = '';
          all_games.innerHTML = '';
          games.forEach(function(game) {
            var date = new Date(game.date).toLocaleDateString('es-AR');
            var local = game.home_team.full_name;
            var points_local = game.home_team_score;
            var points_visitor = game.visitor_team_score;
            var visitor = game.visitor_team.full_name;
      
            all_games.innerHTML += `<div class="game-item">
              <strong>${date}</strong><br>
              ${local} ${points_local} - ${points_visitor} ${visitor}<br><br>
            </div>`;
          });
        })
        .catch(error => {
          console.error('Error al obtener los datos:', error);
        });
}



//Obtener películas:
function GetPeliculas() {
  const input = document.getElementById('input_pelicula').value;
  fetch(`https://api.themoviedb.org/3/search/movie?query=${input}`, {
    headers: {
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlYjBhMWExNDllNTM3MWQ5Mjc5MzBhMTUzZDZlZTgxMyIsIm5iZiI6MTc0Njg3ODg0Ny4zMzMsInN1YiI6IjY4MWY0MTdmMzQzZmI1N2ZkN2FkODhmOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.QuG_fg-mO-PyPtAT0wVUC9cfb9j7G1PR1fdmLNxrT0g',
      'Accept': 'application/json'
    }
  })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      var films = data.results;
      var all_films = document.getElementById('all_films');
      text.innerHTML = '';
      all_films.innerHTML = '';
      all_games.innerHTML = '';
      

      if (films && films.length > 0) {
        
        films.forEach(function(film) {
          var name = film.title;
          var caption = film.overview;
          var photo = `https://image.tmdb.org/t/p/w500${film.poster_path}`;

          all_films.innerHTML += `<div class="film-item">
            <img src="${photo}"><br>
            <strong>${name}</strong><br>
            ${caption}<br>
          </div>`;
        });
      } else {
        all_films.innerHTML = 'No se encontraron resultados.';
      }
    })
    .catch(error => {
      console.error('Error al obtener los datos:', error);
    });
}



