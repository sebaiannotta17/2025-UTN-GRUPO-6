# TP Grupo 13 - Series y Strapi

Este proyecto es parte del **Trabajo Práctico Nº 2** de la materia **Tecnología y Gestión Web**. Permite consultar series populares desde la API de TheMovieDB, guardarlas en Strapi (CMS headless) y visualizar los datos con gráficos interactivos.

## 📁 Estructura del proyecto

```
TyGWeb/
├── index.html      # Página principal
├── styles.css      # Estilos CSS
├── script.js       # Lógica JavaScript
└── README.md       
```

## 🎯 Funcionalidades

1. **Cargar datos de APIs**: Obtiene las 10 series más populares desde 2020 de TheMovieDB y las guarda en Strapi
2. **Visualizar datos**: Muestra las series guardadas en Strapi con tarjetas informativas y gráfico de barras
3. **Gráfico interactivo**: Visualiza el promedio de votos de las series usando Chart.js

## 📄 Explicación del código

### `index.html`
```html
<!DOCTYPE html>
<html lang="es">
<head>
  <!-- Configuración básica del documento -->
  <meta charset="UTF-8">
  <title>TP Grupo 13 - Series y Strapi</title>
  
  <!-- Enlaces a archivos externos -->
  <link rel="stylesheet" href="styles.css">
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
  <!-- Estructura del layout -->
  <header>TP Nro 2 - Grupo 13</header>
  
  <div class="main-layout">
    <!-- Barra lateral con botones de acción -->
    <aside>
      <ul>
        <li><button id="btnCargarGuardar">Cargar datos de APIs</button></li>
        <li><button id="btnVisualizar">Visualizar datos</button></li>
      </ul>
    </aside>
    
    <!-- Área principal de contenido -->
    <main>
      <h2>Series más populares (2020+)</h2>
      <p class="subtitulo">Consulta y visualiza información...</p>
      <div id="resultado"></div>              <!-- Aquí se muestran las tarjetas -->
      <div style="...">
        <canvas id="graficoSeries"></canvas>   <!-- Aquí se dibuja el gráfico -->
      </div>
    </main>
  </div>
  
  <footer>TygWeb 2025</footer>
  <script src="script.js"></script>
</body>
</html>
```

### `styles.css`
Define el diseño visual del sitio:
- **Layout flexbox**: `main-layout` usa `display: flex` para crear la estructura de barra lateral + contenido principal
- **Colores**: Paleta de azules y grises para un diseño profesional
- **Componentes**: Estilos para botones, tarjetas (`.card`), header, footer
- **Responsivo**: El diseño se adapta a diferentes tamaños de pantalla

### `script.js` - Explicación detallada

#### 🔧 Variables de configuración
```javascript
const apiKey = '7a0da2a763bb92d8230a59dab03bd601';     // Clave API de TheMovieDB
const strapiToken = '099da4cc6cbb36bf7af8de6f1f241f8c...'; // Token de autenticación para Strapi
const urlApi = `https://api.themoviedb.org/3/discover/tv...`; // URL para buscar series populares
const strapiUrl = 'https://gestionweb.frlp.utn.edu.ar/api/G13_serie'; // Endpoint de Strapi

let generoLookup = {};    // Objeto para mapear IDs de géneros a nombres
let chartInstance = null; // Referencia al gráfico actual (para poder destruirlo)
```

#### 🎭 Función `obtenerGeneros()`
```javascript
async function obtenerGeneros() {
  // Hace una petición a la API para obtener la lista de géneros de TV
  const res = await fetch(`https://api.themoviedb.org/3/genre/tv/list?api_key=${apiKey}&language=es-ES`);
  const data = await res.json();
  
  // Crea un objeto lookup: {16: "Animación", 35: "Comedia", ...}
  data.genres.forEach(g => {
    generoLookup[g.id] = g.name;
  });
}
```
**¿Para qué?** TheMovieDB devuelve los géneros como IDs numéricos (ej: `[16, 35]`). Esta función los convierte a nombres legibles ("Animación, Comedia").

#### 🎨 Función `mostrarSeries(series)`
```javascript
function mostrarSeries(series) {
  const resultado = document.getElementById('resultado');
  resultado.innerHTML = "";  // Limpia el contenido anterior
  
  // Por cada serie, crea una tarjeta HTML
  series.forEach(serie => {
    resultado.innerHTML += `
      <div class="card">
        <h3>${serie.name}</h3>
        <p><strong>Géneros:</strong> ${serie.genre_ids.map(id => generoLookup[id] || id).join(", ")}</p>
        <p><strong>Sinopsis:</strong> ${serie.overview}</p>
        <p><strong>Votos:</strong> ${serie.vote_count}</p>
        <p><strong>Promedio:</strong> ${serie.vote_average}</p>
      </div>
    `;
  });

  // Llama a la función para crear el gráfico
  mostrarGrafico(series.map(s => s.name), series.map(s => s.vote_average));
}
```
**¿Para qué?** Convierte los datos de las series en tarjetas HTML visibles y activa el gráfico.

#### 📊 Función `mostrarGrafico(labels, data)`
```javascript
function mostrarGrafico(labels, data) {
  const ctx = document.getElementById('graficoSeries').getContext('2d');
  
  // Si ya existe un gráfico, lo destruye para evitar superposiciones
  if (chartInstance) {
    chartInstance.destroy();
  }
  
  // Crea un nuevo gráfico de barras con Chart.js
  chartInstance = new Chart(ctx, {
    type: 'bar',                    // Tipo: gráfico de barras
    data: {
      labels: labels,               // Nombres de las series (eje X)
      datasets: [{
        label: 'Promedio de votos',
        data: data,                 // Valores de promedio (eje Y)
        backgroundColor: 'rgba(33, 150, 243, 0.6)',  // Color de las barras
        borderColor: 'rgba(33, 150, 243, 1)',
        borderWidth: 1,
        borderRadius: 5
      }]
    },
    options: {
      responsive: true,             // Se adapta al tamaño del contenedor
      plugins: {
        legend: { display: false }, // Oculta la leyenda
        title: { display: true, text: 'Promedio de votos de las series' }
      },
      scales: {
        y: { beginAtZero: true, max: 10 }  // Eje Y de 0 a 10
      }
    }
  });
}
```
**¿Para qué?** Crea un gráfico visual que muestra qué series tienen mejor promedio de votos.

#### 📥 Función `cargarSeries()` - **FUNCIÓN PRINCIPAL DE CARGA**
```javascript
async function cargarSeries() {
  const resultado = document.getElementById('resultado');
  resultado.innerHTML = "<p>Cargando datos de series...</p>";
  
  try {
    // PASO 1: Cargar géneros para poder convertir IDs a nombres
    await obtenerGeneros();
    
    // PASO 2: Obtener series populares de TheMovieDB
    const res = await fetch(urlApi);
    const data = await res.json();
    const series = data.results.slice(0, 10);  // Solo las primeras 10
    
    resultado.innerHTML = "<p>Guardando datos en Strapi...</p>";
    let uploadsExitosos = 0;

    // PASO 3: Guardar cada serie en Strapi
    for (const serie of series) {
      // Convierte los IDs de géneros a nombres
      const generos = serie.genre_ids.map(id => generoLookup[id] || id).join(", ");
      
      // Prepara los datos en el formato que espera Strapi
      const serieData = {
        titulo: serie.name,
        sinopsis: serie.overview,
        generos: generos,
        votos_promedio: serie.vote_average,
        cantidad_votos: serie.vote_count
      };

      try {
        // Envía los datos a Strapi vía POST
        const resStrapi = await fetch(strapiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${strapiToken}`  // Token de autenticación
          },
          body: JSON.stringify({ data: serieData })
        });
        
        if (resStrapi.ok) {
          uploadsExitosos++;
        } else {
          console.error("Error al guardar serie en Strapi:", await resStrapi.text());
        }
      } catch (error) {
        console.error("Error de red al contactar Strapi:", error);
      }
    }

    // PASO 4: Mostrar resultado del guardado
    if (uploadsExitosos === series.length) {
      resultado.innerHTML = `<p>✔ Los datos se guardaron correctamente en Strapi.</p>`;
    } else if (uploadsExitosos > 0) {
      resultado.innerHTML = `<p>⚠ Se guardaron ${uploadsExitosos} de ${series.length} series.</p>`;
    } else {
      resultado.innerHTML = `<p>❌ No se pudo guardar ninguna serie en Strapi.</p>`;
    }

    // PASO 5: Mostrar las series en pantalla (independientemente del guardado)
    mostrarSeries(series);

  } catch (error) {
    console.error("Error en cargarSeries:", error);
    resultado.innerHTML = `<p>❌ ${error.message}.</p>`;
  }
}
```
**¿Para qué?** Esta es la función más importante. Orquesta todo el proceso: obtener datos de la API externa, guardarlos en Strapi y mostrarlos en pantalla.

#### 📤 Función `visualizarSeries()` - **FUNCIÓN DE VISUALIZACIÓN**
```javascript
async function visualizarSeries() {
  const resultado = document.getElementById('resultado');
  resultado.innerHTML = "<p>Cargando datos guardados...</p>";
  
  try {
    // PASO 1: Obtener datos guardados desde Strapi
    const res = await fetch(strapiUrl, {
      headers: {
        'Authorization': `Bearer ${strapiToken}`
      }
    });
    const data = await res.json();
    
    // PASO 2: Validar la respuesta
    if (!data || !Array.isArray(data.data)) {
      throw new Error("La respuesta de Strapi no es una colección válida.");
    }
    if (data.data.length === 0) {
      resultado.innerHTML = "<p>No se encontraron datos en Strapi. Puede que necesites cargarlos primero.</p>";
      return;
    }
    
    // PASO 3: Mostrar cada serie como tarjeta HTML
    resultado.innerHTML = "";
    data.data.forEach(item => {
      const attrs = item.attributes || item;  // Strapi envuelve los datos en 'attributes'
      resultado.innerHTML += `
        <div class="card">
          <h3>${attrs.titulo}</h3>
          <p><strong>Géneros:</strong> ${attrs.generos}</p>
          <p><strong>Sinopsis:</strong> ${attrs.sinopsis}</p>
          <p><strong>Votos:</strong> ${attrs.cantidad_votos}</p>
          <p><strong>Promedio:</strong> ${attrs.votos_promedio}</p>
        </div>
      `;
    });
  } catch (error) {
    console.error("Error en visualizarSeries:", error);
    resultado.innerHTML = `<p>❌ Error al mostrar los datos: ${error.message}</p>`;
  }
}
```
**¿Para qué?** Recupera los datos previamente guardados en Strapi y los muestra. Es útil para verificar qué se guardó correctamente.

#### 🔗 Event Listeners
```javascript
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('btnCargarGuardar').addEventListener('click', cargarSeries);
  document.getElementById('btnVisualizar').addEventListener('click', visualizarSeries);
});
```
**¿Para qué?** Espera a que el HTML esté completamente cargado antes de asociar las funciones a los botones. Sin esto, los botones no funcionarían.

## 🔄 Flujo de trabajo

1. **Usuario hace clic en "Cargar datos de APIs"**:
   - Se ejecuta `cargarSeries()`
   - Obtiene géneros de TheMovieDB
   - Busca las 10 series más populares desde 2020
   - Intenta guardar cada serie en Strapi
   - Muestra las series en tarjetas + gráfico

2. **Usuario hace clic en "Visualizar datos"**:
   - Se ejecuta `visualizarSeries()`
   - Consulta a Strapi los datos previamente guardados
   - Los muestra en formato de tarjetas

## 🛠️ Tecnologías utilizadas

- **HTML5**: Estructura del sitio
- **CSS3**: Diseño y layout (Flexbox)
- **JavaScript ES6+**: Lógica de la aplicación (async/await, fetch API)
- **Chart.js**: Librería para gráficos interactivos
- **TheMovieDB API**: Fuente de datos de series
- **Strapi**: CMS headless para almacenamiento

## 📋 APIs utilizadas

- **TheMovieDB - Discover TV**: Buscar series populares
- **TheMovieDB - Genre List**: Obtener nombres de géneros
- **Strapi - G13_serie**: Endpoint personalizado para el grupo 13

## 🚀 Cómo ejecutar

1. Abrir `index.html` en un navegador web
2. Hacer clic en "Cargar datos de APIs" para obtener y guardar series
3. Hacer clic en "Visualizar datos" para ver datos guardados en Strapi

---
**Desarrollado por**: Grupo 13