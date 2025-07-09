document.addEventListener('DOMContentLoaded', () => {
  const contenedorGatos = document.getElementById('contenedorGatos');
  const apiKey = 'live_b8iaPD5vGXVAuKyXx9VePqOjYPDWiZ5GoTPoGmpKgw6l6CPw8eESJJKe5AbfiXjx';

  const obtenerGatos = async () => {
    try {
      const response = await fetch(`https://api.thecatapi.com/v1/images/search?limit=8`, {
        headers: { 'x-api-key': apiKey }
      });
      const gatos = await response.json();

      gatos.forEach(gato => {
        const img = document.createElement('img');
        img.src = gato.url;
        img.alt = 'Gato feliz';
        contenedorGatos.appendChild(img);
      });

    } catch (error) {
      console.error('Error al cargar los gatos:', error);
      contenedorGatos.innerHTML = '<p>Error</p>';
    }
  };

  obtenerGatos();
});