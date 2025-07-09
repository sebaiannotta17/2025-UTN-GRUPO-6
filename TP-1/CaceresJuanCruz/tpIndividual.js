    document.getElementById("api1").addEventListener('click',function(event){
        event.preventDefault();
        buscarLibros();
    })
    document.getElementById("api2").addEventListener('click',function(event){
        event.preventDefault();
        buscarArte();
    })
    
    const frases=[
        {texto:"Un hombre de virtuosas palabras no es siempre un hombre virtuoso. - Confucio", clase:"f1"},
        {texto:"No es a la muerte a lo que el hombre debe temer, sino a no empezar a vivir.- Marco Aurelio ", clase:"f2"},
        {texto:"La suerte es lo que ocurre cuando la preparación coincide con la oportunidad - Seneca", clase:"f1"}]
    
    const indice = Math.floor(Math.random() * frases.length);
    const fraseSeleccionada = frases[indice];
    
    const frase= document.getElementById('frase');
    frase.textContent=fraseSeleccionada.texto;
    frase.classList.add(fraseSeleccionada.clase);
    
    function buscarLibros() {
      const url = `https://openlibrary.org/search.json?q=page=1&limit=5`;
        resultado2=document.getElementById("resultado2");
      resultado2.innerHTML='';
      titulo=document.getElementById("TitApi");
      titulo.innerHTML="Libros"
      fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log(data); //muestra todo el objeto
          const libros = data.docs;
          const resultado = document.getElementById('resultado');
          resultado.innerHTML = '';

          libros.slice(0, 5).forEach(libro => {
            const div = document.createElement('div');
            div.className = 'galeria';

            const img = document.createElement('img');
            if (libro.cover_i) {
              img.src = `https://covers.openlibrary.org/b/id/${libro.cover_i}-M.jpg`;
              img.alt = libro.title;
              img.style="max-width:90%;height:auto;";
            } else {
              img.src = 'https://via.placeholder.com/100x150?text=Sin+portada';
            }

            const info = document.createElement('div');
            info.innerHTML = `

              <strong>${libro.title}</strong><br>
              ${libro.author_name ? libro.author_name.join(', ') : 'Autor desconocido'}
            `;
            div.style="border: 1px solid black;padding:10px";
            div.appendChild(img);
            div.appendChild(info);
            resultado.appendChild(div);
          });
        })
        .catch(error => {
          console.error('Error:', error);
        });
    }

    function buscarArte() {
      //const query = document.getElementById('search').value;
      resultado2=document.getElementById("resultado2");
      resultado=document.getElementById("resultado");
      resultado.innerHTML='';
      titulo=document.getElementById("TitApi");
      titulo.innerHTML="Arte"
      fetch(`https://api.artic.edu/api/v1/artworks?page=1&limit=5`)
        .then(response => response.json())
        .then(data => {
            console.log(data); //muestra todo el objeto
            const arte=data.data;
           resultado2.innerHTML = '';
            arte.slice(0, 10).forEach(arte => {
                if (!arte.image_id) return;

                const imagenURL=`https://www.artic.edu/iiif/2/${arte.image_id}/full/843,/0/default.jpg`;


                const div = document.createElement('div');
                div.classList.add('arte');
                div.innerHTML = `
                                <h3>${arte.title}</h3>
                                <p><strong>Artista: </strong>${arte.artist_title}</p>
                                <p><strong>Fecha: </strong>${arte.date_display}</p>
                                <img src="${imagenURL}" alt="arte.title" style="max-width:40%;height:auto;">
                
                `;
                div.style="border: 1px solid black;padding:10px";

                resultado2.appendChild(div)
    
            })
        })
        .catch(error => {
            resultado2.innerHTML=`<p>error en la carga de obras:${error.message} </p>`
          console.error('Error:', error);
        });

        

    }