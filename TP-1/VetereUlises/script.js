const frases = [
  { texto: "Poder decir adiós... Es crecer", clase: "sombra1" },
  { texto: "El fin de amar es sentirse más vivo.", clase: "sombra2" },
  { texto: "La vida dura un salto, quedarse, una muerte segura", clase: "sombra3" }
];

$(document).ready(function () {
  const i = Math.floor(Math.random() * frases.length);
  const fraseSeleccionada = frases[i];
  $("#frase")
    .text(fraseSeleccionada.texto)
    .addClass(fraseSeleccionada.clase);
});

function getRandomBreakingBadQuote() {
  $.ajax({
    url: 'https://api.breakingbadquotes.xyz/v1/quotes',
    method: 'GET',
    success: function (response) {
      $("#apirq").empty();
      $("#apirq").css("display", "block");
      $("#apirq").append("<h3>API: Breaking Bad Quote</h3>");
      $("#apirq").append("<p><strong>Cita:</strong> " + response[0].quote + "</p>");
      $("#apirq").append("<p><strong>Autor:</strong> " + response[0].author + "</p>");
    },
    error: function (req, status, err) {
      console.error("Error al consumir la API:", err);
      $("#apirq").empty();
      $("#apirq").css("display", "block");
      $("#apirq").append("<p>No se pudo cargar la información. Por favor, inténtelo nuevamente más tarde.</p>");
    }
  });
}

function getPokemon() {
  const randomId = Math.floor(Math.random() * 898) + 1;
  $.ajax({
    url: 'https://pokeapi.co/api/v2/pokemon/' + randomId,
    method: 'GET',
    success: function (response) {
      $("#apirq").empty();
      $("#apirq").css("display", "block");
      $("#apirq").append("<h3>API: PokéAPI</h3>");
      $("#apirq").append("<p><strong>Pokémon:</strong> " + response.name.charAt(0).toUpperCase() + response.name.slice(1) + "</p>");
      $("#apirq").append("<p><strong>ID:</strong> " + response.id + "</p>");
      $("#apirq").append("<p><strong>Tipo:</strong> " + response.types.map(t => t.type.name).join(", ") + "</p>");
      $("#apirq").append("<img src='" + response.sprites.front_default + "' alt='" + response.name + "'>");
    },
    error: function (req, status, err) {
      console.log(req, status, err);
      $("#apirq").empty();
      $("#apirq").append("<p>Error al cargar el Pokémon.</p>");
    }
  });
}
