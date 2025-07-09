const api1 = document.querySelector('#api1')
const api2 = document.querySelector('#api2')
const div1 = document.querySelector('#data1')
const div2 = document.querySelector('#data2')
api1.addEventListener('click', (e) => {
  div1.style.display = 'block';
  div2.style.display = 'none';
})
api2.addEventListener('click', (e) => {
  div2.style.display = 'block';
  div1.style.display = 'none';
})


fetch('https://api.nasa.gov/planetary/apod?api_key=fNFhpQD4ZpMy15K0yXfhOKvML1ZEb4t66R9TuDoI')
  .then((response) => {
    if (!response.ok) {
      console.log("the response is not okey");
    }
    return response.json()
  }
  )
  .then(jsonData => {

    imprimir(jsonData)
  });

// api 2
fetch('https://dolarapi.com/v1/dolares')
  .then((response) => {
    if (!response.ok) {
      console.log("the response is not okey");
    }
    return response.json()
  })
  .then(jsonData => {
    console.log(jsonData)
    // div2.innerHTML = `
    // <h1>Dolar Blue</h1>
    // <h2>Venta: ${jsonData.venta}</h2>
    // <h2>Compra: ${jsonData.compra}</h2>
    // `
    jsonData.forEach(element => {
      div2.innerHTML += `
<div style='border: solid 2px white'>
      <h1>Dolar ${element.nombre}</h1>
      <h2>Venta: ${element.venta}</h2>
      <h2>Compra: ${element.compra}</h2>
</div>    
`
    })
  });







function imprimir(imagenesNasa) {

  // Recorro los datos del objeto para imprimir los datos
  for (let key in imagenesNasa) {
    // Verificamos si el atributo que se pasó por parametro no sea heredado
    if (imagenesNasa.hasOwnProperty(key)) {
      div1.innerHTML = `
        <h1>Image Of The Day</h1>
        <h2>Title: ${imagenesNasa.title}</h2>
        <h4>Date: ${imagenesNasa.date}</h4>
        <p>${imagenesNasa.explanation}</p>
        <img src="${imagenesNasa.hdurl}" width=960 height=540></img>
        `
    }
  }

}
