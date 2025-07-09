// Lista de frases con clases de sombra
const frases = [
  { texto: "Del segundo nadie se acuerda", clase: "sombra1" },
  { texto: "No importa el como, siempre hay que buscar ganar", clase: "sombra2" },
  { texto: "Messi y Maradona son mas grandes que Pele", clase: "sombra3" }
];

window.onload = function () {
  // Elegir una frase al azar
  const fraseSeleccionada = frases[Math.floor(Math.random() * frases.length)];

  // Obtener el elemento HTML donde mostrar la frase
  const elementoFrase = document.getElementById("frase");

  // Asignar el texto y la clase de sombra
  elementoFrase.textContent = fraseSeleccionada.texto;
  elementoFrase.classList.add(fraseSeleccionada.clase);
};
