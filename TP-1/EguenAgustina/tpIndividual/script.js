document.addEventListener('DOMContentLoaded', () => {
    const frasesInspiradoras = [
        "El único modo de hacer un gran trabajo es amar lo que haces. – Steve Jobs",
        "La lógica te llevará de A a B. La imaginación te llevará a todas partes. – Albert Einstein",
        "No dejes que los miedos decidan por ti. – Paulo Coelho"
    ];


    const fraseElements = [
        document.getElementById('frase1'),
        document.getElementById('frase2'),
        document.getElementById('frase3')
    ];

    // Mostrar una frase aleatoria al cargar la página
    function mostrarFraseAleatoria() {
        const randomIndex = Math.floor(Math.random() * frasesInspiradoras.length);
        fraseElements.forEach((el, index) => {
            el.textContent = ''; // Limpia todas las frases
        });
        fraseElements[randomIndex].textContent = frasesInspiradoras[randomIndex];
    }
        mostrarFraseAleatoria();
});



    // Implementación de APIs
function mostrarDato(tipo) {
  const resultado = document.getElementById("api-results");
  resultado.innerHTML = "Cargando...";

  //Muestra un dato curioso en ingles porque no pude en español 
  switch (tipo) {
    case "dato":
      fetch("https://uselessfacts.jsph.pl/random.json?language=es")
        .then(res => res.json())
        .then(data => {
          resultado.innerHTML = `<div><h3>🤯 Dato curioso</h3><p>${data.text}</p></div>`;
        })
        .catch(error => {
          resultado.innerHTML = "<p>Error al cargar el dato curioso.</p>";
          console.error(error);
        });
      break;

      //Muestra un consejo tambien en ingles
    case "consejo":
      fetch("https://api.adviceslip.com/advice")
        .then(res => res.json())
        .then(data => {
          resultado.innerHTML = `<div><h3>💬 Consejo del día</h3><p>"${data.slip.advice}"</p></div>`;
        })
        .catch(error => {
          resultado.innerHTML = "<p>Error al cargar el consejo.</p>";
          console.error(error);
        });
      break;

    default:
      resultado.innerHTML = "Seleccioná una opción del menú.";
  }
}
