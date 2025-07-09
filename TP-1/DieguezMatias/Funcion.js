function generarImagen() {
  const ancho = 400;
  const alto = 300;
  const timestamp = new Date().getTime(); // para que no se repita la imagen
  const url = `https://picsum.photos/${ancho}/${alto}?random=${timestamp}`;
  document.getElementById('imagen').src = url;
}

const frases = [
      { texto: "Haz hoy lo que otros no quieren, y mañana vivirás como otros no pueden.", clase: "sombra1" },
      { texto: "El éxito es la suma de pequeños esfuerzos repetidos cada día.", clase: "sombra2" },
      { texto: "No cuentes los días, haz que los días cuenten.", clase: "sombra3" }
];

function generarFrase() {
      const aleatoria = frases[Math.floor(Math.random() * frases.length)];
      const elemento = document.getElementById('frase');
      elemento.textContent = aleatoria.texto;
      elemento.className = `frase ${aleatoria.clase}`;
}

window.onload = function() {
  generarFrase();
}

function generarGato() {
  const url = `https://cataas.com/cat?random=${Math.random()}`;
  document.getElementById('gato').src = url;
}