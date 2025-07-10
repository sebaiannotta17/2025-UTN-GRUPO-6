const API_KEY = 'd50ef063f403773840e85b0faf4fcb57';

async function getUniqueProdCompanies() {

  // Pido las 5 peliculas mejor valoradas
  const urlTop = `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&language=es-ES&page=1`;
  const resTop  = await fetch(urlTop);
  const dataTop = await resTop.json();
  const top5    = dataTop.results.slice(0, 5);

  // Junto las productoras 
  const setProd = new Set();

  for (const movie of top5) {
    const urlDet = `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${API_KEY}&language=es-ES`;
    const resDet = await fetch(urlDet);
    const det    = await resDet.json();

    det.production_companies.forEach(pc => setProd.add(pc.name));
  }

  // Creo el array para strapi
  const prodArray = Array.from(setProd).map(name => ({ name }));

  renderList(prodArray);

  return prodArray;
}

function renderList(arr) {
  const ul = document.getElementById('lista-productoras');
  ul.innerHTML = '';
  arr.forEach(obj => {
    const li = document.createElement('li');
    li.textContent = obj.name;
    ul.appendChild(li);
  });
}

document
  .getElementById('btn-cargar')
  .addEventListener('click', () => {
    getUniqueProdCompanies()
      .then(arr => console.log('Array listo para Strapi:', arr));
  });

