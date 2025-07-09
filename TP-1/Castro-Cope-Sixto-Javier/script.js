var frases = [
    "El código es poesía en movimiento, cada línea cuenta una historia",
    "La programación no es solo escribir código, es resolver problemas humanos", 
    "Con gran poder computacional viene gran responsabilidad ética"
];

window.onload = function() {
    var numero = Math.floor(Math.random() * frases.length);
    var parrafo = document.createElement('p');
    parrafo.className = 'frase' + (numero + 1);
    parrafo.textContent = frases[numero];
    document.getElementById('frase').appendChild(parrafo);
};

function esconder() {
    document.getElementById('seccion-astronautas').style.display = 'none';
    document.getElementById('seccion-imagenes').style.display = 'none';
}

// astronautas
document.getElementById('api1').onclick = function(e) {
    e.preventDefault();
    esconder();
    document.getElementById('seccion-astronautas').style.display = 'block';
    
    var lista = document.getElementById('lista-astronautas');
    var contador = document.getElementById('total-astronautas');
    lista.innerHTML = '';
    contador.textContent = 'Cargando...';
    
    fetch('http://api.open-notify.org/astros.json')
        .then(respuesta => respuesta.json())
        .then(datos => {
            datos.people.forEach(function(persona) {
                var item = document.createElement('li');
                item.textContent = persona.name + ' - ' + persona.craft;
                lista.appendChild(item);
            });
            contador.textContent = 'Total: ' + datos.number;
        })
        .catch(function() {
            lista.innerHTML = '<li>No se pudo cargar</li>';
            contador.textContent = 'Error';
        });
};

// imagenes
document.getElementById('api2').onclick = function(e) {
    e.preventDefault();
    esconder();
    document.getElementById('seccion-imagenes').style.display = 'block';
    
    var galeria = document.getElementById('galeria-imagenes');
    
    setTimeout(function() {
        galeria.innerHTML = '';
        for(var i = 0; i < 6; i++) {
            var num = Math.floor(Math.random() * 1000) + 1;
            var foto = document.createElement('img');
            foto.src = 'https://picsum.photos/300/200?random=' + num;
            foto.alt = 'Foto ' + (i + 1);
            galeria.appendChild(foto);
        }
    }, 400);
};