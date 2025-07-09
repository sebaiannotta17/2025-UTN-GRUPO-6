document.addEventListener('DOMContentLoaded', function() {
    const mainContent = document.getElementById('main-content');
    const api1Link = document.getElementById('api1');
    const api2Link = document.getElementById('api2');

    const urlApi1 = 'https://restcountries.com/v3.1/name/argentina';
    const urlApi2 = 'https://open.er-api.com/v6/latest/USD';

    async function cargarYMostrarDatos(url, mostrarFuncion) {
        try {
            const respuesta = await fetch(url);
            const datos = await respuesta.json();
            mostrarFuncion(datos);
        } catch (error) {
            mainContent.innerHTML = '<p class="error">Error al cargar los datos.</p>';
            console.error(error);
        }
    }

    function mostrarPais(data) {
        const pais = data[0];
        mainContent.innerHTML = `
            <h2>${pais.name.common}</h2>
            <p>Capital: ${pais.capital ? pais.capital[0] : 'No disponible'}</p>
            <p>Población: ${pais.population}</p>
            <img src="${pais.flags.png}" alt="Bandera" width="100">
        `;
    }

    function mostrarCambio(data) {
        const monedasDeseadas = ['ARS', 'EUR', 'JPY', 'GBP', 'CHF', 'CAD', 'AUD', 'CNY', 'SEK', 'NZD', 'MXN'];
        let ratesContent = '<h2>Tipo de Cambio (Base USD) del peso Argentino y las 10 monedas mas usadas en el mundo</h2>';
        ratesContent += '<div class="currency-container">';

        monedasDeseadas.forEach(currency => {
            if (data.rates[currency]) {
                ratesContent += `<div class="currency-item">
                                    <strong>${currency}:</strong> ${data.rates[currency].toFixed(2)}
                                 </div>`;
            } else {
                ratesContent += `<div class="currency-item">
                                    <strong>${currency}:</strong> No disponible
                                 </div>`;
            }
        });
        ratesContent += '</div>';
        mainContent.innerHTML = ratesContent;
    }

    api1Link.addEventListener('click', function(e) {
        e.preventDefault();
        cargarYMostrarDatos(urlApi1, mostrarPais);
    });

    api2Link.addEventListener('click', function(e) {
        e.preventDefault();
        cargarYMostrarDatos(urlApi2, mostrarCambio);
    });

});