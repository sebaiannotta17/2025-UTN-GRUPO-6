const frases = [
  { texto: "\"La creatividad es únicamente conectar cosas\" - Steve Jobs", clase: "estilo1" },
  { texto: "\"El éxito consiste en ir de fracaso en fracaso sin perder el entusiasmo\" - Leslie Lamport", clase: "estilo2" },
  { texto: "\"Todo está predestinado. Incluso mis respuestas\" - Dr. Manhattan", clase: "estilo3" }
];

function mostrarFrase() {
  const frase = frases[Math.floor(Math.random() * frases.length)];
  const fraseElem = document.getElementById("frase");
  fraseElem.className = `frase ${frase.clase}`;
  fraseElem.textContent = frase.texto;
}


mostrarFrase(); 