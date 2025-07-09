Document.addEventListener('DOMContentLoaded', function () {
  const enlace1 = document.getElementById('link1');
  const contenedor1= document.getElementById('contenedor-api1');
   const enlace2 = document.getElementById('link2');
  const contenedor2 = document.getElementById('contenedor-api2');
   const enlace3 = document.getElementById('link3');
  const contenedor3 = document.getElementById('contenedor-api3');

enlace1.addEventListener('click', function (e) {
    e.preventDefault();
    fetch('https://dog.ceo/api/breeds/image/random')
      .then(res => res.json())
      .then(data => {
        contenedor1.innerHTML = `<img src="${data.message}" alt="Perrito" style="width:150px; height:150px; margin: 10px;">`;
      })
      .catch(err => {
        contenedor1.innerHTML = `<p>Error</p>`;
        console.error(err);
      });
  });
enlace2.addEventListener('click', function (e) {
    e.preventDefault();
    fetch('https://api.thecatapi.com/v1/images/search')
      .then(res => res.json())
      .then(data => {
        contenedor2.innerHTML = `<img src="${data[0].url}" alt="gatito" style="height:150px; width:150px; margin-top: 10px;">`;
      })
      .catch(() => {
        contenedor2.innerHTML = '<p>Error</p>';
      });
  });
enlace3.addEventListener('click', function (e) {
    e.preventDefault();
    fetch('https://catfact.ninja/fact')
      .then(res => res.json())
      .then(data => {
        contenedor3.innerHTML = `<p>${data.fact}</p>`;
      })
      .catch(() => {
        contenedor3.innerHTML = '<p>Error</p>';
      });
  });




});
