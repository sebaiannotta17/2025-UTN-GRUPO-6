let googleChartsLoaded = false;

google.charts.load('current', { packages: ['geochart'] });
google.charts.setOnLoadCallback(() => {
  googleChartsLoaded = true;
});

google.charts.load('current', { packages: ['corechart'] });
google.charts.setOnLoadCallback(() => {
  window.googleChartsLoaded = true;
});

const getSeries = async () => {
    try {
        const response = await fetch(`${STRAPI_URL}/api/grupo-5-series?populate=*`, {
            headers: {
                Authorization: `Bearer ${jwtToken}`,
            },
        });
        const data = await response.json();
        return data
    } catch (error) {
        console.error(error);
    }
}
const visualizar = async () => {
    const container = document.querySelector('.content');
    container.innerHTML = '';
    const series = await getSeries();
    console.log(series.data);
    if (!series || series.data.length === 0) {
        const noSeries = document.createElement('p');
        noSeries.textContent = 'No hay series disponibles.';
        container.appendChild(noSeries);
        return;
    }
    visualizarLista(series, container);
    container.appendChild(document.createElement('hr'));
    if (!googleChartsLoaded) {
    console.log('Google Charts no está listo aún');
    return;
    }
    visualizarAnalytics(series, container);
}

const visualizarLista = (series, container) => {
    const lista = document.createElement('div');
    container.appendChild(lista);
    lista.className = 'series-lista';
    series.data.forEach(async (serie) => {
        const card = document.createElement('div');
        const generos = serie.grupo_5_generos.map(genero => {          
            return `<span class="badge bg-secondary mr-2">${genero.nombre}</span>`;
        }).join('');
        card.className = 'card mb-3';
        card.innerHTML = `
            <div class="card-body">
                <h5 class="card-title">${serie.titulo}</h5>
                <p class="card-text">${serie.sinopsis}</p>
                <p class="card-text"><small class="text-muted">País de origen: ${serie.paisOrigen}</small></p>
                <p class="card-text"><small class="text-muted">Popularidad: ${serie.popularidad}</small></p>
                <p class="card-text mb-0"><small class="text-muted">Géneros: </small></p>
                <div class="generos">
                    ${generos}
                </div>
            </div>  
        `;
        lista.appendChild(card);
    });
}


const visualizarAnalytics = (series, container) => {
    if (!google || !google.charts) {
        console.error("Google Charts no está disponible");
        return;
    }

    const chartDiv = document.createElement("div");
    chartDiv.style.width = "900px";
    chartDiv.style.height = "500px";
    chartDiv.style.margin = "0 auto"
    container.appendChild(chartDiv);

    const datosPorPais = {};

    series.data.forEach((serie) => {
        const pais = serie.paisOrigen;
        const popularidad = parseFloat(serie.popularidad) || 0;
        const generos = Array.isArray(serie.grupo_5_generos)
        ? serie.grupo_5_generos.map(g => g.nombre.trim())
        : ['No especificado'];    
        if (!pais) return;  
        if (!datosPorPais[pais]) {
                datosPorPais[pais] = {
                popularidadTotal: 0,
                generos: {}
            };
        }   
        datosPorPais[pais].popularidadTotal += popularidad; 
        generos.forEach((genero) => {
            if (!datosPorPais[pais].generos[genero]) {
                datosPorPais[pais].generos[genero] = 0;
            }
                datosPorPais[pais].generos[genero] += popularidad;
        });
    }); 
    const dataArray = [['Country', 'Popularity', { type: 'string', role: 'tooltip' }]];
    for (const pais in datosPorPais) {
        const datos = datosPorPais[pais];
        const generos = datos.generos;

    let generoMasVisto = "";
    let maxPopularidad = -1;
    for (const genero in generos) {
      if (generos[genero] > maxPopularidad) {
        maxPopularidad = generos[genero];
        generoMasVisto = genero;
      }
    }

    const tooltip = `Popularidad total: ${datos.popularidadTotal.toFixed(2)}\nGénero más visto: ${generoMasVisto}`;
    dataArray.push([pais, datos.popularidadTotal, tooltip]);
  }

  const data = google.visualization.arrayToDataTable(dataArray);
  const options = {
    tooltip: { isHtml: false }
  };
  const chart = new google.visualization.GeoChart(chartDiv);
  chart.draw(data, options);


  const CakeDiv = document.createElement("div");
  CakeDiv.style.width = "900px";
  CakeDiv.style.height = "500px";
  CakeDiv.style.margin = "0 auto"
  container.appendChild(CakeDiv);
  const popularidadPorGenero = {};
  
  series.data.forEach((serie) => {
      const popularidad = parseFloat(serie.popularidad) || 0;
      const generos = Array.isArray(serie.grupo_5_generos)
      ? serie.grupo_5_generos.map(g => g.nombre.trim())
      : ['No especificado'];
      
      generos.forEach((genero) => {
          if (!popularidadPorGenero[genero]) {
              popularidadPorGenero[genero] = 0;
            }
            popularidadPorGenero[genero] += popularidad;
        });
    });
    
    const cakeDataArray = [['Género', 'Popularidad']];
    for (const genero in popularidadPorGenero) {
        cakeDataArray.push([genero, popularidadPorGenero[genero]]);
    }
    
    const cakeData = google.visualization.arrayToDataTable(cakeDataArray);
    
    const cakeOptions = {
        title: 'Popularidad total por género'
    };
    
    const cakeChart = new google.visualization.PieChart(CakeDiv);
    cakeChart.draw(cakeData, cakeOptions);

}