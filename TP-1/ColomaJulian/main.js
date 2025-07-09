//Logica frases
const frases =[
    'La imaginación es más importante que el conocimiento',
    'La vida es lo que pasa mientras estás ocupado haciendo otros planes.',
    'El éxito es aprender a ir de fracaso en fracaso sin desesperarse.'
];

const p = document.getElementById("frases");
let random = Math.floor(Math.random() * 3)
p.innerHTML = frases[random];
switch (random){
    case 0:
        p.style.textShadow = '1px 1px 3px #32CD32';
    break;
    case 1:
        p.style.textShadow = '0 0 5px #0ff, 0 0 10px #0ff, 0 0 20px #0ff';
    break;
    case 2:
        p.style.textShadow = '2px 2px 0 #F7BD56';
    break
}

//Logica apis
const fetchApi1 = async () => {
    try {
        const response = await fetch('http://ip-api.com/json/');
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
      console.error('Error GET:', error);
      return null;
    }
}
const getChiste = async () => {
     try {
        const response = await fetch('https://v2.jokeapi.dev/joke/Programming?lang=en&blacklistFlags=nsfw,religious,political,racist,sexist,explicit');
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
      console.error('Error GET:', error);
      return null;
    }
}
const fetchApi2 = async () => {
    try {
        const response = await fetch('https://dog.ceo/api/breed/akita/images/random');
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
      console.error('Error GET:', error);
      return null;
    }
}

//Manejar el evento
const section = document.getElementById('main-content');
const handleApi1 = async() => {
    const data = await fetchApi1();
    section.innerHTML = `
    <div class="ipInfo">
    <h3>Información de IP</h3>
    <p><strong>IP:</strong> ${data.query}</p>
    <p><strong>Ubicación:</strong> ${data.city}, ${data.regionName}, ${data.country}</p>
    <p><strong>Código Postal:</strong> ${data.zip}</p>
    <p><strong>Lat/Lng:</strong> ${data.lat}, ${data.lon}</p>
    <p><strong>ISP:</strong> ${data.isp}</p>
    <p><strong>Organización:</strong> ${data.org}</p>
    <p><strong>AS:</strong> ${data.as}</p>
    <p><strong>Zona Horaria:</strong> ${data.timezone}</p>
    </div>
  `;
}
const handleApi2 = async() => {
    const data = await fetchApi2();
    const chiste = await getChiste();
    const content = chiste.joke? `
    <div class="Chistes">
    <img src=${data.message} alt="foto de un perro" width="500">
    <p class="textoApi">${chiste.joke}<p>
    </div>
    ` : `
    <div class="Chistes">
    <img src=${data.message} alt="foto de un perro" width="500">
    <h3 class="textoApi">${chiste.setup}</h3>
    <p class="textoApi">${chiste.delivery}</p>
    </div>
    `

    section.innerHTML = content
}

