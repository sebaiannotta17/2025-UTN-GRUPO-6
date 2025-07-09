function obtenerLibro(event) {
    event.preventDefault();
    bookDiv=document.getElementById("book");
    bookDiv.innerText = "Buscando libro...";
      fetch("https://gutendex.com/books/?random=true")
        .then(response => response.json())
        .then(data => {
          var libros = data.results;
          var i = Math.floor(Math.random() * 32);
          bookDiv=document.getElementById("book");
            bookDiv.innerText = libros[i].title;
            const imag=document.getElementById("img");
            imag.src = libros[i].formats["image/jpeg"];;
            document.getElementById("titulo").style.display = "block";
        });
}

function obtenerCafé(event) {
    event.preventDefault();
        fetch("https://api.sampleapis.com/coffee/hot")
          .then(response => response.json())
          .then(data => {
            const cafeDiv=document.getElementById("cafe");
            var i = Math.floor(Math.random() * 28);
            while (i==25){
              i = Math.floor(Math.random() * 28);
            };
            cafeDiv.innerText = data[i].title;
            const imag=document.getElementById("img2");
            imag.src = data[i].image;
            document.getElementById("titulo").style.display = "block";
          });
}

function mostrarFrase() {
    var l = Math.floor(Math.random() * 3);
    var mostrar = "frase_" + l;
    document.getElementById(mostrar).style.display = "block";
};

window.onload = function() {
    mostrarFrase();
}