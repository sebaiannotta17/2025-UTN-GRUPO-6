//frases
const frases = ['"El fracaso no es más que una oportunidad de volver a empezar, esta vez de un modo más inteligente" - Henry Ford ','"Si cambias la forma en que miras las cosas, las cosas que miras cambian" - Wayne Dyer ','"Está bien celebrar el éxito, pero es más importante prestar atención a las lecciones del fracaso" - Bill Gates']
let frase = frases[Math.floor(Math.random() * 3)];
document.querySelector('#frase').innerText = frase;

// apis
const main = document.querySelector('main');
const links = document.querySelectorAll("a");
//api de users
const getUsers = async () => {
    const response = await fetch('https://randomuser.me/api/?results=5');
    const data = await response.json();
    console.log(data.results);
    return data;
}
links.item(0)
.addEventListener("click", function (e) {
    e.preventDefault();
    main.innerHTML = '<h2>Usuarios</h2>';
    const ol =  document.createElement('ol');
    main.appendChild(ol);
    getUsers().then(data => {
        data.results.forEach(user => {
            const li = document.createElement('div');
            li.innerHTML = `
                <img src="${user.picture.medium}" alt="Foto de ${user.name.first} ${user.name.last}">
                <p>${user.name.first} ${user.name.last}</p>
                <p>${user.email}</p>
            `;
            li.classList.add('elemento');
            ol.appendChild(li);
        });
    });
});
//api de chistes
const getChistes = async () => {
    const response = await fetch('https://v2.jokeapi.dev/joke/Any?amount=5&type=twopart&blacklistFlags=nsfw,religious,political,racist,sexist,explicit');
    const data = await response.json();
    console.log(data);
    return data;
}
links.item(1)
.addEventListener("click", function (e) {
    e.preventDefault();
    main.innerHTML = '<h2>Chistes</h2>';
    const ol =  document.createElement('ol');
    main.appendChild(ol);
    getChistes().then(data => {
            data.jokes.forEach(joke => {
                const li = document.createElement('li');
                li.innerText = joke.setup + ' - ' + joke.delivery;
                li.classList.add('elemento');
                ol.appendChild(li);
    });
    });
});
//api de pokemon
const getPokemon = async () => {
    const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=5');
    const data = await response.json();
    console.log(data.results);
    return data;
}
links.item(2)
.addEventListener("click", function (e) {
    e.preventDefault();
    main.innerHTML = '<h2>Pokémon</h2>';
    const ol =  document.createElement('ol');
    main.appendChild(ol);
    getPokemon().then(data => {
        data.results.forEach(pokemon => {
            const li = document.createElement('li');
            li.innerText = `Nombre: ${pokemon.name}`;
            fetch(pokemon.url)
            .then(response => response.json())
            .then(details => {
                const img = document.createElement('img');
                img.src = details.sprites.front_default;
                img.alt = pokemon.name;
                li.appendChild(img);
            });
            li.classList.add('elemento');
            
            ol.appendChild(li);
        });
    });
}
);
//api de libros
const getLibros = async () => {
    const response = await fetch('https://www.googleapis.com/books/v1/volumes?q=javascript&maxResults=5');
    const data = await response.json();
    console.log(data.items);
    return data;
}
links.item(3)
.addEventListener("click", function (e) {
    e.preventDefault();
    main.innerHTML = '<h2>Libros</h2>';
    const ol =  document.createElement('ol');
    main.appendChild(ol);
    getLibros().then(data => {
        data.items.forEach(book => {
            const li = document.createElement('li');
            //añadir libro con detalles
            li.innerText = `${book.volumeInfo.title} - ${book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : 'Autor desconocido'}`;
            if (book.volumeInfo.imageLinks) {
                const img = document.createElement('img');
                img.src = book.volumeInfo.imageLinks.thumbnail;
                img.alt = book.volumeInfo.title;
                li.appendChild(img);
            }
            li.classList.add('elemento');
            ol.appendChild(li);
        });
    });
}
);




