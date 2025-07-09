function loadAPI1() {
    fetch('https://es.wikipedia.org/w/api.php?action=parse&format=json&origin=*&page=Anexo:Palmar%C3%A9s_del_Club_Atl%C3%A9tico_River_Plate&prop=text')
    .then(response => response.json())
    .then(data => {
        const htmlContent = data.parse.text['*'];
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, 'text/html');
        
        // Selecciona todos los párrafos hasta el título "Palmarés del equipo de Fútbol Masculino"
        const paragraphs = doc.querySelectorAll('p');
        let content = '';
        for (let paragraph of paragraphs) {
            if (paragraph.nextElementSibling && paragraph.nextElementSibling.tagName === 'H2' && paragraph.nextElementSibling.innerText.includes('Palmarés del equipo de Fútbol Masculino')) {
                break;
            }
            content += `<p>${paragraph.innerText}</p>`;
        }
        
        // Muestra el contenido en el elemento <main> con el título solicitado
        document.querySelector('main').innerHTML = `<h2>PALMARES DE RIVER PLATE</h2>${content}`;
    })
    .catch(error => console.error('Error:', error));
}

function loadAPI2() {
    fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false')
    .then(response => response.json())
    .then(data => {
        let output = '<h2>Top Cryptos</h2><ul>';
        data.forEach(crypto => {
            output += `<li>${crypto.name}: $${crypto.current_price}</li>`;
        });
        output += '</ul>';
        document.querySelector('main').innerHTML = output;
    })
    .catch(error => console.error('Error:', error));
}

function showRandomPhrase() {
    const phrases = [
        { text: "Que la gente crea, porque tiene con qué creer.", shadow: 'shadow1' },
        { text: "Estos dos meses que nosotros venimos jugando muy mal fue parte de la estrategia.", shadow: 'shadow2' },
        { text: "Tenemos que estar con la guardia alta.", shadow: 'shadow3' }
    ];
    
    const randomIndex = Math.floor(Math.random() * phrases.length);
    const selectedPhrase = phrases[randomIndex];
    
    const phraseElement = document.getElementById('random-phrase');
    phraseElement.innerText = selectedPhrase.text;
    phraseElement.className = selectedPhrase.shadow;
}

showRandomPhrase();
