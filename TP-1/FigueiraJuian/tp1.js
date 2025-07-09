 function BuscarLibro(){
         var con=document.getElementById("buscar").value.trim();
         
        fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(con)}`)
        .then(res => res.json())
        .then(data => {
          const cont = document.getElementById("total");
          cont.innerHTML = `Total resultados: ${data.numFound}`;

          if (data.docs.length === 0) {
            cont.innerHTML += "<br>No se encontraron libros.";
            return;
          }

          data.docs.slice(0, 10).forEach(libro => {
            const titulo = libro.title || "Sin título";
            const autor = (libro.author_name || ["Autor desconocido"]).join(", ");
            cont.innerHTML += `<p>${titulo} - ${autor}</p>`;
          });
        })
        .catch(() => {
          document.getElementById("contenido").textContent = "Error al buscar libros.";
        });

     }
  
       function Animal(){
            fetch("https://dog.ceo/api/breeds/image/random")
            .then(res=> res.json())
            .then(data=>{
                if(data.status === "success") {
                document.getElementById("imgperro").src = data.message;
          }
        })
        .catch(() => {
          document.getElementById("imgperro").textContent = "Error al cargar imagen.";
        });
    }

        window.onload=function(){
        const frase=[
            {texto:"La practica hace al maestro.", class:"frase1"},
            {texto:"Son nuestras elecciones las que muestran quienes somos, mucho más que nuestras habilidades.", class:"frase2"},
            {texto:"Lo que no te mata te fortalece", class:"frase3"}
        ];

        const fraseAl=frase[Math.floor(Math.random()*frase.length)];
        const frasediv=document.getElementById("aleatorio");
        frasediv.textContent=fraseAl.texto;
        frasediv.className=fraseAl.class;
        }     
       