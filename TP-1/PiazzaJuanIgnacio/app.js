function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.substr(1)
}

function dailyQuote(){
    const quotes = ["What I cannot create, I do not understand.", "Loyalty is it's own reward.", 
        "Life is the Emperor's currency, spend it well.", "Blessed is the mind too small for doubt.",
        "I haven't lost an arm, brother. It's right over there.", 
        "We follow in the footsteps of Guilliman. As it is writen in the Codex, so shall it be"];
    const authors = ["Richard Feynmann", "Lion El'Jonson", "Codex: Black Templars", "Imperial Creed",
        "Captain Alessio Cortez", "Marneus Calgar"]
    pos = Math.floor(Math.random() * quotes.length);

    const main = document.getElementById("content");
    
    const quote = document.createElement("p");
    quote.textContent = quotes[pos];
    const author = document.createElement("p");
    author.textContent = "- " + authors[pos];
    author.style.fontStyle = "italic";
    quote.style.fontSize = "1.2rem";

    const container = document.createElement("div");
    container.appendChild(quote);
    container.appendChild(author);

    main.appendChild(container);
}

async function requestPokeAPI(){
    const main = document.getElementById("content");
    main.innerHTML = "";
    const id = Math.floor(Math.random() * 1025)
    const url = "https://pokeapi.co/api/v2/pokemon/" + id;
    fetch(url).then((res) => res.json())
        .then((data) => {
            const poke = new PokemonRender();
            poke.name = capitalize(data.name);
            poke.id = data.id;
            poke.sprite = data.sprites.other['official-artwork']['front_default'];
            main.appendChild(poke);
            console.log(data);
        })
    .catch(console.error)
    //TODO: render output
}

async function requestDigiAPI(){
    const main = document.getElementById("content");
    main.innerHTML = "";
    const url = "https://digi-api.com/api/v1/digimon";
    fetch(url).then((res) => res.json())
        .then((data) => { 
            const id = Math.floor(Math.random() * data.pageable.totalElements);
            return fetch(`${url}/${id}`);
        })
        .then((res) => res.json())
        .then((data) => {
            const digi = new DigimonRender();
            digi.id = data.id;
            digi.name = data.name;
            digi.sprite = data.images[0].href;
            digi.attribute = data.attributes[0].attribute;
            digi.level = data.levels[0].level;
            digi.type = data.types[0].type;
            main.appendChild(digi);
            console.log(data)
        })
        .catch(console.error)
    //TODO: render output
}

class PokemonRender extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({mode: 'open'});
    }
    
    get name() {
        return this.getAttribute('name');
    }

    set name(val) {
        this.setAttribute('name', val);
    }

    get id() {
        return this.getAttribute('id');
    }

    set id(val) {
        this.setAttribute('id', val);
    }

    get sprite() {
        return this.getAttribute('sprite');
    }

    set sprite(val) {
        this.setAttribute('sprite', val);
    }

    static get observedAttributes() {
        return['name', 'id', 'sprite']
    }

    connectedCallback(){
        this.render();
    }

    render() {
        this.shadow.innerHTML = `
        <style>
            .pokemon {
                max-width: 400px;
                display: flex;
                flex-direction: column; 
            }
            .pokemon-title {
                display: flex;
                justify-content: space-between;
                width: 100%;
            }
            .title-child {
                flex: 1;
            }
            .pokemon-sprite {
                max-width: 100%;
                height: auto;
                display: block;
            }
        </style>
        <div class="pokemon" id="pokemon">
            <div class="pokemon-title" id="pokemon-title">
                <div class="title-child" id="title-child">
                    <h2>Name: ${this.name}</h2>
                </div>
                <div class="title-child" id="title-child">
                    <h2>ID: ${this.id}<h2>
                </div>
            </div>
            <img class="pokemon-sprite" id="pokemon-sprite" src="${this.sprite}" alt="official artwork"/>
        </div>
        `
    }
}

class DigimonRender extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({mode: 'open'});
    }

    get id(){
        return this.getAttribute('id');
    }

    set id(val){
        this.setAttribute('id', val);
    }

    get name(){
        return this.getAttribute('name');
    }

    set name(val){
        this.setAttribute('name', val);
    }

    get sprite(){
        return this.getAttribute('sprite');
    }

    set sprite(val){
        this.setAttribute('sprite', val);
    }

    get type(){
        return this.getAttribute('type');
    }

    set type(val){
        this.setAttribute('type', val);
    }

    get attribute(){
        return this.getAttribute('attribute');
    }

    set attribute(val){
        this.setAttribute('attribute', val);
    }

    get level(){
        return this.getAttribute('level');
    }

    set level(val){
        this.setAttribute('level', val);
    }

    static get observedAttributes() {
        return['id','name', 'sprite', 'level', 'attribute', 'type']
    }

    connectedCallback(){
        this.render();
    }

    render() {
        this.shadow.innerHTML = `
        <style>
            .digimon-container {
                max-width: 500px;
                display: flex;
                flex-direction: column;
            }
            .digimon-sprite {
                max-width: 100%;
                height: auto;
                display: block;
            }
            .horizontal-container {
                display: flex;
                justify-content: space-between;
                width: 100%;
            }
            .vertical-container {
                flex: 1;
            }
        </style>
        <div class="digimon-container" id="digimon-container">
            <h3>ID: ${this.id}</h3>
            <h2>Name: ${this.name}</h2>
            <img src="${this.sprite}" alt="Official sprite" class="digimon-sprite" id="digimon-sprite"/>
            <div class="horizontal-container" id="horizontal-container">
                <div class="vertical-container" id="vertical-container">
                    <h3>Level</h3>
                    <h4>${this.level}</h4>
                </div>
                <div class="vertical-container" id="vertical-container">
                    <h3>Attribute</h3>
                    <h4>${this.attribute}</h4>
                </div>
                <div class="vertical-container" id="vertical-container">
                    <h3>Type</h3>
                    <h4>${this.type}</h4>
                </div>
            </div>
        </div>
        `
    }
}

window.onload = dailyQuote();
window.customElements.define('pokemon-render', PokemonRender);
window.customElements.define('digimon-render', DigimonRender);
