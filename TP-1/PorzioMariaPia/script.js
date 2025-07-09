const frases = [
  "La moda es la forma de decir quién eres sin hablar.",
  "Cada día es una pasarela, elige tu estilo.",
  "La creatividad viste al mundo con colores nuevos."
];

let coloresGuardados = [];

/*Eligimos una frase aleatoria del array frase y le aplica una sombra en particular*/
function mostrarFraseAleatoria() {
  const fraseDiv = document.getElementById('frase');

  const index = Math.floor(Math.random() * frases.length);
  const frase = frases[index];
  const claseSombra = `sombra${index + 1}`;

  fraseDiv.innerHTML = `<p class="${claseSombra} frase-completa">${frase}</p>`;
}

/*Funcion para generar un color hexadecimal aleatorio. Sirve como color base para generar la paleta de colores */
function colorHexRandom() {
  const hex = Math.floor(Math.random() * 16777215).toString(16);
  return hex.padStart(6, '0');
}

/*Llamamos a la API thecolorapi.com para obtener una paleta de 5 colores similares.*/
async function mostrarPaleta() {
  const dinamico = document.getElementById('contenido-dinamico');
  dinamico.innerHTML = '<p>Cargando paleta de colores...</p>';

  const colorBase = colorHexRandom();
  const url = `https://www.thecolorapi.com/scheme?hex=${colorBase}&mode=analogic&count=5`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Error en respuesta API');

    const data = await response.json();

    coloresGuardados = data.colors.map(c => c.name.value.split(" ").pop().toLowerCase());

    let html = `<h3>Paleta del Día (color base: #${colorBase})</h3>`;
    data.colors.forEach(c => {
      html += `<div class="color-box" style="background-color:${c.hex.value};">${c.name.value}</div>`;
    });

    dinamico.innerHTML = html;
  } catch (e) {
    dinamico.innerHTML = '<p>Error al cargar la paleta.</p>';
    console.error(e);
  }
}

/*Muestramos una imagen aleatoria de moda llamando a la API */
function mostrarImagenPorColor() {
  const dinamico = document.getElementById('contenido-dinamico');
  const url = `https://picsum.photos/800/600?random=${new Date().getTime()}`;
  dinamico.innerHTML = `
    <h3>Imagen random de moda</h3>
    <img class="moda" src="${url}" alt="Imagen random de moda">
  `;
}

document.addEventListener('DOMContentLoaded', () => {
  mostrarFraseAleatoria();
});
