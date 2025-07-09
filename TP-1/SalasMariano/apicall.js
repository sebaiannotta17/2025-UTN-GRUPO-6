document.addEventListener('DOMContentLoaded', () => {
    const api1Link = document.querySelector('#aside-menu a:first-child');
    const api2Link = document.querySelector('#aside-menu a:last-child');

    api1Link.addEventListener('click', async (e) => {
        e.preventDefault();

        document.getElementById('frase1').style.display = 'none';
        document.getElementById('frase2').style.display = 'none'; 
        document.getElementById('frase3').style.display = 'none';
        document.getElementById('expectativa').style.display = 'none';
        document.getElementById('api1').style.display = 'block';

        try {
            const contenedor = document.getElementById('api1');
            contenedor.innerHTML = '<div class="loader"></div>';
            
            const response = await fetch('https://jsonplaceholder.typicode.com/users');
            const data = await response.json();
            
            const usuarioAleatorio = data[Math.floor(Math.random() * data.length)];
            
            const content = document.createElement('div');
            content.className = 'api-content';
            
            const titulo = document.createElement('h3');
            titulo.textContent = 'Información del Usuario';
            titulo.style.color = 'white';
            titulo.style.marginBottom = '20px';
            titulo.style.textAlign = 'center';
            titulo.style.fontSize = '1.8rem';
            titulo.style.textShadow = '0 2px 5px rgba(0,0,0,0.2)';
            
            content.appendChild(titulo);

            const card = document.createElement('div');
            card.className = 'user-card';
            card.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
            card.style.backdropFilter = 'blur(10px)';
            card.style.borderRadius = '12px';
            card.style.padding = '25px';
            card.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
            card.style.color = 'white';
            card.style.position = 'relative';
            card.style.overflow = 'hidden';
            card.style.zIndex = '2';
            
            const infoContainer = document.createElement('div');
            infoContainer.style.display = 'grid';
            infoContainer.style.gridTemplateColumns = 'repeat(auto-fit, minmax(250px, 1fr))';
            infoContainer.style.gap = '15px';
            
            const crearInfo = (label, value) => {
                const item = document.createElement('div');
                item.className = 'info-item';
                item.style.marginBottom = '15px';
                
                const labelEl = document.createElement('div');
                labelEl.className = 'info-label';
                labelEl.textContent = label;
                labelEl.style.fontSize = '0.9rem';
                labelEl.style.textTransform = 'uppercase';
                labelEl.style.letterSpacing = '1px';
                labelEl.style.marginBottom = '5px';
                labelEl.style.opacity = '0.8';
                
                const valueEl = document.createElement('div');
                valueEl.className = 'info-value';
                valueEl.textContent = value;
                valueEl.style.fontSize = '1.2rem';
                valueEl.style.fontWeight = '500';
                
                item.appendChild(labelEl);
                item.appendChild(valueEl);
                return item;
            };

            infoContainer.appendChild(crearInfo('Nombre', usuarioAleatorio.name));
            infoContainer.appendChild(crearInfo('Usuario', usuarioAleatorio.username));
            infoContainer.appendChild(crearInfo('Email', usuarioAleatorio.email));
            infoContainer.appendChild(crearInfo('Teléfono', usuarioAleatorio.phone));
            infoContainer.appendChild(crearInfo('Sitio Web', usuarioAleatorio.website));
            infoContainer.appendChild(crearInfo('Dirección', `${usuarioAleatorio.address.street}, ${usuarioAleatorio.address.suite}`));
            infoContainer.appendChild(crearInfo('Ciudad', usuarioAleatorio.address.city));
            infoContainer.appendChild(crearInfo('Compañía', usuarioAleatorio.company.name));
            
            card.appendChild(infoContainer);
            
            const decoration = document.createElement('div');
            decoration.style.position = 'absolute';
            decoration.style.bottom = '-50px';
            decoration.style.right = '-50px';
            decoration.style.width = '200px';
            decoration.style.height = '200px';
            decoration.style.borderRadius = '50%';
            decoration.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            decoration.style.zIndex = '1';
            
            card.appendChild(decoration);
            content.appendChild(card);
            
            contenedor.innerHTML = '';
            contenedor.appendChild(content);
            
            content.style.opacity = '0';
            content.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                content.style.transition = 'all 0.5s ease';
                content.style.opacity = '1';
                content.style.transform = 'translateY(0)';
            }, 100);
    
        } catch (error) {
            console.error('Error al obtener datos:', error);
            const contenedor = document.getElementById('api1');
            contenedor.innerHTML = '<div class="error-message">Error al cargar datos</div>';
        }
    });

    api2Link.addEventListener('click', async (e) => {
        e.preventDefault();

        document.getElementById('frase1').style.display = 'none';
        document.getElementById('frase2').style.display = 'none'; 
        document.getElementById('frase3').style.display = 'none';
        document.getElementById('expectativa').style.display = 'none';
        document.getElementById('api1').style.display = 'block';

        try {
            const contenedor = document.getElementById('api1');
            contenedor.innerHTML = '<div class="loader"></div>';
            
            const response = await fetch('https://api.nasa.gov/planetary/apod?api_key=YKBtaSquMpoGO95e0lbbvQLqBDY4uEdPCus4thk7');
            const data = await response.json();

            const content = document.createElement('div');
            content.className = 'api-content';
            
            const titulo = document.createElement('h3');
            titulo.textContent = data.title;
            titulo.style.color = 'white';
            titulo.style.marginBottom = '20px';
            titulo.style.textAlign = 'center';
            titulo.style.fontSize = '1.8rem';
            titulo.style.textShadow = '0 2px 5px rgba(0,0,0,0.2)';
            
            const imageContainer = document.createElement('div');
            imageContainer.style.position = 'relative';
            imageContainer.style.width = '100%';
            imageContainer.style.marginBottom = '20px';
            imageContainer.style.borderRadius = '12px';
            imageContainer.style.overflow = 'hidden';
            imageContainer.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.2)';
            
            const imagen = document.createElement('img');
            imagen.src = data.url;
            imagen.alt = data.title;
            imagen.style.width = '100%';
            imagen.style.display = 'block';
            imagen.style.transition = 'transform 0.5s ease';
            
            imageContainer.appendChild(imagen);
            
            imageContainer.addEventListener('mouseenter', () => {
                imagen.style.transform = 'scale(1.05)';
            });
            
            imageContainer.addEventListener('mouseleave', () => {
                imagen.style.transform = 'scale(1)';
            });
            
            const descripcion = document.createElement('div');
            descripcion.className = 'description-card';
            descripcion.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
            descripcion.style.backdropFilter = 'blur(10px)';
            descripcion.style.borderRadius = '12px';
            descripcion.style.padding = '25px';
            descripcion.style.color = 'white';
            descripcion.style.position = 'relative';
            descripcion.style.overflow = 'hidden';
            descripcion.style.zIndex = '2';
            
            const textoDesc = document.createElement('p');
            textoDesc.textContent = data.explanation;
            textoDesc.style.lineHeight = '1.7';
            textoDesc.style.fontSize = '1.1rem';
            textoDesc.style.textAlign = 'justify';
            
            descripcion.appendChild(textoDesc);
            
            const fecha = document.createElement('div');
            fecha.textContent = `Fecha: ${new Date(data.date).toLocaleDateString()}`;
            fecha.style.marginTop = '15px';
            fecha.style.fontSize = '0.9rem';
            fecha.style.opacity = '0.8';
            
            descripcion.appendChild(fecha);
            
            content.appendChild(titulo);
            content.appendChild(imageContainer);
            content.appendChild(descripcion);
            
            contenedor.innerHTML = '';
            contenedor.appendChild(content);
            
            content.style.opacity = '0';
            content.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                content.style.transition = 'all 0.5s ease';
                content.style.opacity = '1';
                content.style.transform = 'translateY(0)';
            }, 100);

        } catch (error) {
            console.error('Error al obtener datos de la NASA:', error);
            const contenedor = document.getElementById('api1');
            contenedor.innerHTML = '<div class="error-message">Error al cargar la imagen de la NASA</div>';
        }
    });
});
