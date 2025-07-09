const apiURLs = {
    clima: "https://api.open-meteo.com/v1/forecast?latitude=-34.61&longitude=-58.38&current_weather=true",
    dolar: "https://api.bluelytics.com.ar/v2/latest"
  };
  
  // Usamos proxy para evitar CORS
  const getProxiedURL = url => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
  
  async function cargarAPI(tipo) {
    const contenido = document.getElementById("contenido");
    contenido.innerHTML = "<p>Cargando datos...</p>"; // Feedback visual mientras se espera
  
    try {
      const url = getProxiedURL(apiURLs[tipo]);
      const respuesta = await fetch(url); // Espera a recibir la respuesta completa
  
      if (!respuesta.ok) {
        throw new Error(`HTTP error! Status: ${respuesta.status}`);
      }
  
      const datos = await respuesta.json(); // Espera a que los datos estén parseados
  
      // Llamamos funciones específicas de renderizado según el tipo
      if (tipo === "clima") {
        await mostrarClima(datos); // aunque no sea necesario el await acá, es coherente si fuera más compleja
      } else if (tipo === "dolar") {
        await mostrarDolar(datos);
      }
  
    } catch (error) {
      contenido.innerHTML = "<p>Error al cargar datos de la API.</p>";
      console.error("Error cargando API:", error);
    }
  }
  
  async function mostrarClima(datos) {
    const clima = datos.current_weather;
    const html = `
      <h2>Clima actual en Buenos Aires</h2>
      <ul>
        <li><strong>Temperatura:</strong> ${clima.temperature} °C</li>
        <li><strong>Viento:</strong> ${clima.windspeed} km/h</li>
        <li><strong>Dirección del viento:</strong> ${clima.winddirection}°</li>
      </ul>
    `;
    document.getElementById("contenido").innerHTML = html;
  }
  
  async function mostrarDolar(datos) {
    const dolar = datos.blue;
    const html = `
      <h2>Dólar Blue</h2>
      <ul>
        <li><strong>Compra:</strong> $${dolar.value_buy}</li>
        <li><strong>Venta:</strong> $${dolar.value_sell}</li>
        <li><strong>Promedio:</strong> $${dolar.value_avg}</li>
      </ul>
      <p><small>Última actualización: ${new Date(datos.last_update).toLocaleString()}</small></p>
    `;
    document.getElementById("contenido").innerHTML = html;
  }
  
    // Frase aleatoria
    const frases = [
        { texto: 'El mayor riesgo es no correr ningún riesgo.', clase: 'sombra1' },
        { texto: 'Las oportunidades no aparecen, las creas.', clase: 'sombra2' },
        { texto: 'La paciencia es un elemento clave del éxito.', clase: 'sombra3' }
      ];
      
      const random = Math.floor(Math.random() * frases.length);
      const fraseElegida = frases[random];
      const fraseElemento = document.getElementById('frase');
      fraseElemento.textContent = fraseElegida.texto;
      fraseElemento.className = fraseElegida.clase;
      