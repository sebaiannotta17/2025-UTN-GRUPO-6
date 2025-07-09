function mostrarPersonajes() {
  const contenedor = document.getElementById('contenedor');
  contenedor.innerHTML = '<p>Cargando personajes...</p>';
  const totalPages = 5;
  const fetches = [];

  for (let i = 1; i <= totalPages; i++) {
    fetches.push(fetch(`https://rickandmortyapi.com/api/character?page=${i}`).then(res => res.json()));
  }

  Promise.all(fetches)
    .then(results => {
      const personajes = results.flatMap(result => result.results);
      contenedor.innerHTML = '';
      personajes.forEach(personaje => {
        const div = document.createElement('div');
        div.className = 'card';
        div.innerHTML = `
          <strong>${personaje.name}</strong><br>
          <img src="${personaje.image}" alt="${personaje.name}" style="width:100px"><br>
          Estado: ${personaje.status}<br>
          Especie: ${personaje.species}
        `;
        contenedor.appendChild(div);
      });
    })
    .catch(error => {
      contenedor.innerHTML = '<p>Error al cargar los personajes.</p>';
      console.error(error);
    });
}

function mostrarPokemon() {
  const contenedor = document.getElementById('contenedor');
  contenedor.innerHTML = '<p>Cargando Pokémon...</p>';
  fetch('https://pokeapi.co/api/v2/pokemon?limit=20')
    .then(response => response.json())
    .then(data => {
      contenedor.innerHTML = '';
      data.results.forEach(pokemon => {
        fetch(pokemon.url)
          .then(response => response.json())
          .then(info => {
            const div = document.createElement('div');
            div.className = 'card';
            div.innerHTML = `
              <strong>${info.name.charAt(0).toUpperCase() + info.name.slice(1)}</strong><br>
              <img src="${info.sprites.front_default}" alt="${info.name}" style="width:100px"><br>
              <span>ID: ${info.id}</span><br>
              <span>Tipo: ${info.types.map(t => t.type.name).join(', ')}</span>
            `;
            contenedor.appendChild(div);
          });
      });
    })
    .catch(error => {
      contenedor.innerHTML = '<p>Error al obtener datos de Pokémon.</p>';
      console.error(error);
    });
}

function mostrarInicio() {
  const frases = [
    { texto: '“A la gloria no se llega por un camino de rosas”. - Osvaldo Zubeldía', clase: 'sombra1' },
    { texto: '“La única verdad es ganar. Lo importante es competir es una frase para los otarios y creada por los perdedores”. - Osvaldo Zubeldía', clase: 'sombra2' },
    { texto: '“Los resultados son la única verdad del fútbol. El lirismo es muy lindo. Yo también fui lírico cuando venía de Junín para ver las exhibiciones de La Máquina. Pero el lirismo necesita sustentarse en triunfos. Si usted juega bien y pierde el lirismo se termina a la tercera derrota”.  - Osvaldo Zubeldía', clase: 'sombra3' }
  ];
  const random = Math.floor(Math.random() * frases.length);
  const frase = frases[random];
  const contenedor = document.getElementById('contenedor');
  contenedor.innerHTML = `
    <div class="frase ${frase.clase}">${frase.texto}</div>
  `;
}

window.onload = mostrarInicio;
