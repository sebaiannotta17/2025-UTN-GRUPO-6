        window.onload = function () {
        const  frases = [
            { texto: "Me gustan los gatos gordos", clase: "sombra1" },
            { texto: "Me gusta el mate", clase: "sombra2" },
            { texto: "Soy de Piscis", clase: "sombra3" }
        ];
        const elegida = frases[Math.floor(Math.random() * frases.length)];
        const divFrase = document.getElementById("frase");
        divFrase.textContent = elegida.texto;
        divFrase.classList.add(elegida.clase);
        };

        function mostrarGatito() {
        fetch("https://api.thecatapi.com/v1/images/search")
            .then(res => res.json())
            .then(data => {
            console.log(data)
            const imagen = data[0].url;
            document.getElementById("resultado").innerHTML = `<img src="${imagen}" alt="Gatito" width="300">`;
            });
        }

        function mostrarPerro() {
        fetch("https://dog.ceo/api/breeds/image/random")
            .then(res => res.json())
            .then(data => {
            const imagen = data.message;
            document.getElementById("resultado").innerHTML = `<img src="${imagen}" alt="Perrito" width="300">`;
            });
        }