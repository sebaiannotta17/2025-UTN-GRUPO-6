const API_KEY = 'd50ef063f403773840e85b0faf4fcb57';

async function getUniqueProdCompanies() {

  // Pido las 5 peliculas mejor valoradas
  const urlTop = `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&language=es-ES&page=1`;
  const resTop  = await fetch(urlTop);
  const dataTop = await resTop.json();
  const top5    = dataTop.results.slice(0, 5);

  // Usamos un Map para evitar repetidos y guardar los datos completos
  const prodMap = new Map();

  for (const movie of top5) {
    const urlDet = `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${API_KEY}&language=es-ES`;
    const resDet = await fetch(urlDet);
    const det    = await resDet.json();

    det.production_companies.forEach(pc => {
      if (!prodMap.has(pc.name)) {
        prodMap.set(pc.name, {
          name: pc.name,
          origin_country: pc.origin_country || '',
          logo_path: pc.logo_path || ''
        });
      }
    });
  }

  // Creo el array para strapi con los datos completos
  const prodArray = Array.from(prodMap.values());

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

// Nueva función para guardar en Strapi
async function guardarProductorasEnStrapi(productoras) {
  const strapiUrl = 'https://gestionweb.frlp.utn.edu.ar/api/g37-productoras';
  const apiToken = '099da4cc6cbb36bf7af8de6f1f241f8c81e49fce15709c4cfcae1313090fa2c1ac8703b0179863b4eb2739ea65ae435e90999adb870d49f9f94dcadd88999763119edca01a6b34c25be92a80ed30db1bcacb20df40e4e7f45542bd501f059201ad578c18a11e4f5cd592cb25d6c31a054409caa99f11b6d2391440e9c72611ea';

  for (const productora of productoras) {
    const bodyPayload = {
      data: {
        name: productora.name,
        origin_country: productora.origin_country || '',
        logo_path: productora.logo_path || ''
      }
    };
    try {
      const response = await fetch(strapiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiToken}`
        },
        body: JSON.stringify(bodyPayload)
      });
      if (response.ok) {
        console.log(`Productora guardada: ${productora.name}`);
      } else {
        const errorData = await response.json();
        console.error(`Error al guardar ${productora.name}:`, errorData);
      }
    } catch (error) {
      console.error(`Error de red al guardar ${productora.name}:`, error);
    }
  }
}

document
  .getElementById('btn-cargar')
  .addEventListener('click', async () => {
    const arr = await getUniqueProdCompanies();
    console.log('Array listo para Strapi:', arr);
    await guardarProductorasEnStrapi(arr);
  });

