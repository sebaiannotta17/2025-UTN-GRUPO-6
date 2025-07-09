const frases = [
    { texto: "¡El fútbol es pasión de multitudes!", clase: "shadow1" },
    { texto: "Cada partido es una historia.", clase: "shadow2" },
    { texto: "Los resultados definen a los campeones.", clase: "shadow3" }
];

const fraseAleatoria = frases[Math.floor(Math.random() * frases.length)];
const fraseElem = document.getElementById('frase');
fraseElem.textContent = fraseAleatoria.texto;
fraseElem.className = fraseAleatoria.clase;

function mostrarAPI(liga) {
    const contenido = document.getElementById('contenido');
    let resultados;

    switch (liga) {
        case 'premier':
            resultados = [
                'Manchester City 3 - 1 Arsenal',
                'Chelsea 2 - 2 Liverpool',
                'Manchester United 1 - 0 Tottenham'
            ];
            break;
        case 'laliga':
            resultados = [
                'Real Madrid 2 - 0 Barcelona',
                'Atlético Madrid 1 - 1 Sevilla',
                'Valencia 3 - 2 Villarreal'
            ];
            break;
        case 'seriea':
            resultados = [
                'Juventus 1 - 0 Inter',
                'Milan 2 - 2 Roma',
                'Napoli 3 - 1 Lazio'
            ];
            break;
        default:
            contenido.innerHTML = '<p>Liga no reconocida.</p>';
            return;
    }

    let html = '<h2>Últimos resultados:</h2><ul>';
    resultados.forEach(res => {
        html += `<li>${res}</li>`;
    });
    html += '</ul>';
    contenido.innerHTML = html;
}
