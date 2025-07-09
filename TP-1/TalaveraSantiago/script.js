
window.addEventListener("DOMContentLoaded", mostrarFraseConSombra);

document.getElementById("logo-header").addEventListener("click",function(){location.reload();})
document.getElementById("inicio").addEventListener("click",function(){location.reload();})

document.getElementById("link-imperro").addEventListener("click", function(e){
  e.preventDefault();
  ImagenPerro();
});

document.getElementById("link-imgato").addEventListener("click", function(e){
  e.preventDefault();
  ImagenGato();
});


//----------------Frases aleatorias----------------

const frases = [
  "'Los gatos pueden girar sus orejas 180 grados'",
  "'El perro más viejo vivió 29 años'",
  "'Los gatos tienen cinco dedos en las patas delanteras'"
];

const configs = [
  //marrón oscuro
  { dx: 2, dy: 2, blur: 3, color: "#411900" },
  //azul y rojo: sombra doble
  { dx: 2, dy: 2, blur: 2, color1: "blue", color2: "red" },
  //celeste y amarillo: sombra doble inversa
  { dx: -2, dy: -2, blur: 2, color1: "cyan", color2: "yellow" }
];

//función para mostrar frase con sombra:
function mostrarFraseConSombra() {
  const idxFrase = Math.floor(Math.random() * frases.length);
  const frase = frases[idxFrase];

  const idxCfg = Math.floor(Math.random() * configs.length);
  const cfg = configs[idxCfg];

  const cont = document.getElementById("frase-aleatoria");
  cont.innerHTML = ""; 

  //recorro cada carácter
  for (let char of frase) {
    const span = document.createElement("span");
    span.className = "span-letra";
    //si es espacio, usar espacio no rompible
    span.textContent = char === " " ? "\u00A0" : char;

    //aplico sombra simple o doble según cfg
    if (cfg.color2) {
      //dos sombras separadas por coma
      span.style.textShadow = 
        `${cfg.dx}px ${cfg.dy}px ${cfg.blur}px ${cfg.color1}, ` +
        `${-cfg.dx}px ${-cfg.dy}px ${cfg.blur}px ${cfg.color2}`;
    } else {
      //sombra única
      span.style.textShadow =
        `${cfg.dx}px ${cfg.dy}px ${cfg.blur}px ${cfg.color}`;
    }

    cont.appendChild(span);
  }
}

//------------------APIs-------------------

//obtener imagen de perro aleatoria
async function fetchRandomDogImage() {
  const response = await fetch("https://dog.ceo/api/breeds/image/random");
  const data = await response.json();
  return data.message; // URL de la imagen
}

//mostrar imagen
async function ImagenPerro() {
  const principal = document.getElementById("principal");
  principal.innerHTML = ""; 

  //obtener la URL de la imagen aleatoria
  const imageUrl = await fetchRandomDogImage();


  //mostrar la imagen del perro
  const img = document.createElement("img");
  img.id = "imagenapi";
  img.src = imageUrl;
  img.alt = "Imagen de perro";
  img.style.maxWidth = "80%";
  img.style.maxHeight = "60vh";
  img.style.borderRadius = "10px";
  img.style.boxShadow = "0 4px 8px rgba(0,0,0,0.3)";
  img.style.display="flex";
  img.style.justifySelf="center";
  img.style.alignSelf="center";

  principal.appendChild(img);
}

//obtener una imagen de gato aleatoria
async function fetchRandomCatImage() {
  const response = await fetch("https://api.thecatapi.com/v1/images/search");
  const data = await response.json();
  return data[0].url; // URL de la imagen de gato
}

//mostrar únicamente la imagen del gato en #principal
async function ImagenGato() {
  const principal = document.getElementById("principal");
  principal.innerHTML = ""; 

  //obtener la URL de la imagen de gato
  const imageUrl = await fetchRandomCatImage();

  //crear y mostrar la etiqueta <img>
  const img = document.createElement("img");
  img.id = "imagenapi";
  img.src = imageUrl;
  img.alt = "Imagen de gato";
  img.style.maxWidth = "80%";
  img.style.maxHeight = "60vh";
  img.style.borderRadius = "10px";
  img.style.boxShadow = "0 4px 8px rgba(0,0,0,0.3)";
  img.style.display="flex";
  img.style.justifySelf="center";
  img.style.alignSelf="center";

  principal.appendChild(img);
}