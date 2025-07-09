
// funcion randomiza las frases a mostrar
function randomFrases(){
var op = Math.floor(Math.random() * 3) + 1;
//uso del quiery por class nav-spacer
var fra=document.querySelector(".nav-spacer");
if(op==1){
  fra.textContent= "El presidente llegó a la casa de gobierno, donde anunció las medidas que ya son conocidas por toda la población. Después de este anuncio, estuvo dos horas contestando preguntas de los periodistas, porque él cree que es importante aclarar todas las dudas que haya respecto a los cambios en la dirección del gobierno.";
}
if(op==2){
  fra.textContent= "Muchas personas creen que los osos polares están en peligro de extinción, pero la denominación correcta sobre la situación de esta especie es que están en situación de conservación vulnerable. De todas formas, es necesario que se actúe rápidamente para evitar que esta especie desaparezca.";
}
if(op==3){
  fra.textContent= "Existen tres modos verbales: indicativo, subjuntivo e imperativo. El modo indicativo se utiliza para narrar hechos, procesos o estados que se consideran reales. El modo subjuntivo se utiliza para expresar sentimientos, pensamientos, emociones, deseos, pedidos, dudas y suposiciones. El modo imperativo se utiliza para dar órdenes y consejos."
}
randomSombras(fra);
}

 //funcion randomiza los sombreados
function randomSombras(elemento){
 var sombras = [
    "2px 2px 5px rgba(0, 0, 0, 0.5)",
    "0 0 5px #0ff, 0 0 10px #0ff, 0 0 20px #0ff",
    "3px 3px 0px #333",
    "2px 2px 0 red, 4px 4px 0 orange, 6px 6px 0 yellow",
    "-2px -2px 4px rgba(255, 0, 255, 0.5)",
    "0 0 8px #00ff00"           
  ];
  var op= Math.floor(Math.random()*sombras.length);
  elemento.style.textShadow = sombras[op];
  
}

function switchAPI(apiType) {
  // Oculta todos los contenedores
  document.getElementById('character-display').style.display = 'none';
  document.getElementById('productos').style.display = 'none';
  document.getElementById('resultado-api').innerHTML = '';

    // Ejecuta la API correspondiente
  if (apiType === 'character') {
    getRandomCharacter();
  } else if (apiType === 'productos') {
    cargarProductos();
  }
}
async function getRandomCharacter() {

    try {
        const response = await fetch('https://randomuser.me/api/');
        const data = await response.json();
        const person = data.results[0];
        
        const characterInfo = {
            name: `${person.name.first} ${person.name.last}`,
            image: person.picture.large,
            details: {
                gender: person.gender,
                country: 'China',
                work:'Shein',
                age: person.dob.age
            }
        };
        displayCharacter(characterInfo, 'Trabajadores de Shein');
        document.getElementById('character-display').style.display = 'block';

    } catch (error) {
        console.error("Error al obtener persona aleatoria:", error);
        document.getElementById('character-display').innerHTML = 
            '<p class="error">Error al cargar los datos. Intenta nuevamente.</p>';
    }
}

function displayCharacter(character, apiName) {
    const characterDisplay = document.getElementById('character-display');
    
    characterDisplay.innerHTML = `
        <div class="character-card">
            <h2>${apiName}</h2>
            <img src="${character.image}" alt="${character.name}" class="character-image">
            <h3>${character.name}</h3>
            <div class="character-details">
                ${Object.entries(character.details).map(([key, value]) => `
                    <p><strong>${key}:</strong> ${value}</p>
                `).join('')}
            </div>
        </div>
    `;
    
    // Actualizar el resultado en el nav
    document.getElementById('resultado-api').innerHTML = ``;
}



function cargarProductos() {
  fetch("https://fakestoreapi.com/products")
    .then(res => res.json())
    .then(productos => {
      const contenedor = document.getElementById("productos");
      contenedor.innerHTML = ""; // limpio contenido previo
      const randomIndex = Math.floor(Math.random() * productos.length);
      const prod = productos[randomIndex];
      const div = document.createElement("div");
      div.classList.add("character-card");  // uso la misma clase para estilo similar
      div.innerHTML = `
        <img src="${prod.image}" alt="${prod.title}">
        <strong>${prod.title}</strong>
        <p>Precio: $${prod.price}</p>
      `;
      contenedor.appendChild(div);
    });
    document.getElementById('productos').style.display = 'block';
}
