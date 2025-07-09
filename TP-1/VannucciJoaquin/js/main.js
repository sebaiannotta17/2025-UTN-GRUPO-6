document.addEventListener('DOMContentLoaded', function() { // Esta funcion espera a que carge el DOM para agregar la frase random
	let randomFrase = document.getElementById('randText')
    cont = document.getElementById('apis');
    const frases = ["No podemos resolver nuestros problemas con el mismo razonamiento que usamos cuando los creamos", "Cuando haces feliz a otras personas, recibes más felicidad a cambio. Deberías meditar bien sobre cuánta felicidad eres capaz de dar", "Es mejor fallar en la originalidad que triunfar en la imitación"];

    const randomShadow = ["0 0 3px #ff0000", "0 0 3px #FF0000, 0 0 5px rgb(242, 255, 0)", "2px 2px 4px rgb(94, 255, 0)"]

	//Seleccionar una frase aleatoria entre las 3 presentadas

	const fraseRandom = frases[Math.floor(Math.random() * frases.length)];

	//Mostrar la frase aleatoria en el documento

	randomFrase.textContent = fraseRandom;
    randomFrase.style.textShadow = randomShadow[Math.floor(Math.random() * randomShadow.length)] // Agrego una de las 3 sombras random al la frase aleatoria

    // Evento para la API numero 1
    document.getElementById('apiPok').addEventListener('click',  ()=> { 
    const id = Math.floor(Math.random() * 1025) + 1;
    fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
        .then(res => res.json())
        .then(data => {
            cont.innerHTML = `
            <strong> Pokemon: </strong> ${data.name.toUpperCase()}<br> 
            <strong>Tipo:</strong> ${data.types.map(t => t.type.name).join(', ')}<br>
            <img src="${data.sprites.front_default}" alt="${data.name}">`;
        })
        .catch(err => {
            cont.textContent = "Error al obtener Pokemon";
        })
    })

    //Evento para la API numero 2

    document.getElementById('apiDb').addEventListener('click', ()=> {
        const id = Math.floor(Math.random() * 53) + 1;
        fetch(`https://dragonball-api.com/api/characters/${id}`)
        .then(res => res.json())
        .then(data => {
        cont.innerHTML = `
            <strong>Personaje:</strong> ${data.name}<br>
            <strong>Raza:</strong> ${data.race}<br>
            <strong>Ki:</strong> ${data.ki}<br>
            <img src="${data.image}" alt="${data.name}" heigth = "100" width = "100">
            `;
        })
        .catch(err => {
            contenido.textContent = "Error al obtener personaje de Dragon Ball.";
        });
    });
});


