function cargarAPI(tipo) {
  const contenedor = document.getElementById("api-container");

  switch (tipo) {
    case 'clima':
        fetch('https://wttr.in/La%20Plata?format=j1')
        .then(res => res.json())
        .then(data => {

        const actual = data.current_condition[0];
        const descripcion = traducirCondicion(actual.weatherDesc[0].value);

        contenedor.innerHTML = `
          <h3>Clima en La Plata:</h3>
          <p>Temperatura: ${actual.temp_C} °C</p>
          <p>Condición: ${descripcion}</p>
          <p>Humedad: ${actual.humidity}%</p>
          <p>Viento: ${actual.windspeedKmph} km/h</p>
          `;
        })
        .catch(() => {
        contenedor.innerHTML = `<p>No se pudo obtener el clima.</p>`;
        });
    break;

    case 'persona':
      fetch('https://randomuser.me/api/?nat=es,mx,ar,co,cl,pe,uy')
      .then(res => res.json())
      .then(data => {
        const user = data.results[0];
        contenedor.innerHTML = `
          <h3>Persona Aleatoria</h3>
          <img src="${user.picture.large}" alt="Foto de ${user.name.first}" style="border-radius: 50%; width: 120px; height: 120px; margin-bottom: 10px;">
          <p><strong>Nombre:</strong> ${user.name.first} ${user.name.last}</p>
          <p><strong>Género:</strong> ${user.gender === 'male' ? 'Hombre' : 'Mujer'}</p>
          <p><strong>País:</strong> ${user.location.country}</p>
          <p><strong>Correo:</strong> ${user.email}</p>
        `;
      })
      .catch(() => {
        contenedor.innerHTML = `<p>No se pudo generar una persona aleatoria.</p>`;
      });
    break;

  }
}

 function cargar_frase() {
    var nfrase=Math.floor(Math.random() * 3)+1;
    var frase=document.getElementById('frase'+nfrase)
    frase.style.display="block";
    return;
  }

function traducirCondicion(ingles) {
  const traducciones = {
    "Sunny": "Soleado",
    "Partly cloudy": "Parcialmente nublado",
    "Cloudy": "Nublado",
    "Overcast": "Cubierto",
    "Mist": "Niebla",
    "Patchy rain possible": "Posible lluvia dispersa",
    "Rain": "Lluvia",
    "Light rain": "Lluvia ligera",
    "Moderate rain": "Lluvia moderada",
    "Heavy rain": "Lluvia intensa",
    "Thunderstorm": "Tormenta",
    "Snow": "Nieve",
    "Clear": "Despejado",
    "Fog": "Niebla",
  };

  return traducciones[ingles] || ingles; 
}


  window.onload=cargar_frase;