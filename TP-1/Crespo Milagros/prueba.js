// Lista de datos curiosos en español (simula una API local)
const curiosities = [
    "La Facultad Regional La Plata, fue creada el 28 de enero de 1954",
    "A lo largo de su historia, la UTN FRLP ha graduado a más de 4.500 profesionales en diversas especialidades de grado, y a más de 500 en carreras de posgrado",
    "En 1986, se sumó la carrera de Ingeniería en Sistemas de Información a la UTN FRLP",
    "Su sede administrativa se encuentra en la ciudad de Buenos Aires pero cuenta con 30 Facultades Regionales",
    "Por su cantidad de alumnos, es la mayor universidad de ingeniería del país",
    "Es importante destacar que desde su creación han egresado más de 30 000 profesionales de sus 17 carreras de grado, lo que equivale a casi la mitad de ingenieros del país",
    "La UTN es la única universidad nacional en Argentina con un carácter federal, ya que tiene 30 facultades regionales a lo largo de todo el país",
    "En la UTN FRLP actualmente la Ingeniería Naval actualmente se encuentra suspendida",
];

function showCuriosityApi() {
    const apiContainer = document.getElementById('apiContainer');
    if (!apiContainer) {
        console.error('Error: No se encontró el elemento #apiContainer');
        return;
    }
    apiContainer.innerHTML = `
        <div class="api-container">
            <h2>Datos Curiosos</h2>
            <p>Hacé click para obtener un dato interesante sobre la UTN:</p>
            <button onclick="getCuriosity()">Obtener Dato</button>
            <div id="result"></div>
            <div id="error"></div>
        </div>
    `;
    console.log('Interfaz de la API renderizada en #apiContainer tras clic en Link 1');
}


function getCuriosity() {
    const resultDiv = document.getElementById('result');
    const errorDiv = document.getElementById('error');

    // Limpio mensajes previos
    resultDiv.textContent = '';
    errorDiv.textContent = '';

    try {

        const randomIndex = Math.floor(Math.random() * curiosities.length);
        const curiosity = curiosities[randomIndex];
        console.log('Dato seleccionado:', curiosity);


        resultDiv.textContent = curiosity;
    } catch (error) {
        console.error('Error:', error.message);
        errorDiv.textContent = `Error al obtener el dato: ${error.message}. Intenta de nuevo.`;
    }
}

// API local de números primos 
function getPrimeNumbers(count = 5) {
    const primes = [];
    let num = 2;
    while (primes.length < count) {
        if (isPrime(num)) {
            primes.push(num);
        }
        num++;
    }
    return primes;
}

// Función para verificar si un número es primo
function isPrime(num) {
    if (num < 2) return false;
    for (let i = 2; i <= Math.sqrt(num); i++) {
        if (num % i === 0) return false;
    }
    return true;
}

// Función para mostrar la interfaz de la API de números primos
function showPrimesApi() {
    const apiContainer = document.getElementById('apiContainer');
    if (!apiContainer) {
        console.error('Error: No se encontró el elemento #apiContainer');
        return;
    }
    apiContainer.innerHTML = `
        <div class="api-container">
            <h2>Números Primos</h2>
            <p>Haz clic para obtener los primeros 5 números primos:</p>
            <button onclick="getPrimes()">Obtener Números Primos</button>
            <div id="result"></div>
            <div id="error"></div>
        </div>
    `;
    console.log('Interfaz de la API de números primos renderizada en #apiContainer tras clic en Link 2');
}

// Función para obtener y mostrar los números primos
function getPrimes() {
    const resultDiv = document.getElementById('result');
    const errorDiv = document.getElementById('error');

    // Limpiar mensajes previos
    resultDiv.textContent = '';
    errorDiv.textContent = '';

    try {
        // Obtener los números primos
        const primes = getPrimeNumbers();
        console.log('Números primos obtenidos:', primes);

        // Mostrar los números primos
        resultDiv.textContent = primes.join(', ');
    } catch (error) {
        console.error('Error:', error.message);
        errorDiv.textContent = `Error al obtener los números primos: ${error.message}. Intenta de nuevo.`;
    }
}