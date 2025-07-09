document.addEventListener('DOMContentLoaded', () => {
  const main = document.querySelector('main');

  const landscapeContainer = document.createElement('div');
  landscapeContainer.className = 'contenedor-gatos';
  main.appendChild(landscapeContainer);

  displayLandscapes();

  function displayLandscapes() {
    landscapeContainer.innerHTML = '';
    for (let i = 0; i < 8; i++) {
      setTimeout(() => {
        const card = document.createElement('div');
        card.className = 'gato-card';
        
        const img = document.createElement('img');
        const randomId = Math.floor(Math.random() * 1000) + 1;
        img.src = `https://picsum.photos/id/${randomId}/800/600`;
        img.alt = 'Paisaje aleatorio';
        
        card.appendChild(img);
        landscapeContainer.appendChild(card);
      }, i * 200); 
    }
  }
});