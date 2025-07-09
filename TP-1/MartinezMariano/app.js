document.addEventListener('DOMContentLoaded', () => {
  let poemas = document.querySelectorAll('p.poesia');
  let indice = Math.floor(Math.random() * poemas.length);

  poemas.forEach((poema, i) => {
    poema.style.display = i === indice ? 'block' : 'none';
  });
});

async function cargarPoema() {
  let respuesta = await fetch('https://poetrydb.org/random');
  let datos = await respuesta.json();
  let poema = datos[0];

  document.querySelector('main > div').innerHTML = `
    <h2 style="margin-top: 3rem;">"${poema.title}"</h2>
    <h3  style="padding: 1rem;">por ${poema.author}</h3>
    <p style="padding: 3rem;">${poema.lines.join('<br>')}</p>
  `;
}
function crearInterfaz() {
  const principal = document.querySelector('main > div');
  const titulo = document.createElement("h2");
  titulo.textContent = "Personaje aleatorio de Rick and Morty";
  titulo.style.textAlign = "center";
  titulo.style.color = "#f5f5f5";
  principal.appendChild(titulo);
  const contenedor = document.createElement("div");
  contenedor.id = "personaje";
  contenedor.style.display = "flex";
  contenedor.style.gap = "1.5rem";
  contenedor.style.backgroundColor = "#2e0f12";
  contenedor.style.color = "#f5f5f5";
  contenedor.style.padding = "1.5rem";
  contenedor.style.borderRadius = "1rem";
  contenedor.style.boxShadow = "0 0 10px #00000080";
  contenedor.style.maxWidth = "800px";
  contenedor.style.margin = "2rem auto";
  contenedor.style.alignItems = "center";
  principal.appendChild(contenedor);
}
async function cargarPersonaje() {
  let id = Math.floor(Math.random()* 826) + 1;
  
  const principal = document.querySelector('main > div');
  principal.innerHTML = "";
  crearInterfaz();

  fetch(`https://rickandmortyapi.com/api/character/${id}`)
    .then(res => res.json())
    .then(data => {
      const personaje = document.getElementById("personaje");
      personaje.innerHTML = "";

      const img = document.createElement("img");
      img.src = data.image;
      img.alt = data.name;
      img.style.borderRadius = "1rem";
      img.style.width = "200px";

      const info = document.createElement("div");
      info.style.display = "flex";
      info.style.flexDirection = "column";
      info.style.gap = "0.5rem";
      
      info.innerHTML = `
      <h3>${data.name}</h3>
      <p><strong>Estado:</strong> ${data.status}</p>    
      <p><strong>Especie:</strong> ${data.species}</p>
      <p><strong>Genero:</strong> ${data.gender}</p>
      <p><strong>Origen:</strong> ${data.origin.name}</p>
      <p><strong>Ubicacion:</strong> ${data.location.name}</p>
      `;
      personaje.appendChild(img);
      personaje.appendChild(info);
    });
}











