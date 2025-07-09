async function dolar() {
    try {
        const response = await fetch("https://dolarapi.com/v1/dolares/oficial");
        if (!response.ok) {
            throw new Error("Error al obtener los datos");
        }
        const data = await response.json();

        const mainContent = document.querySelector(".main-content");
        mainContent.innerHTML = `
            <h2>${data.moneda} ${data.nombre}</h2>
            <p><strong>Compra:</strong> $${data.compra}</p>
            <p><strong>Venta:</strong> $${data.venta}</p>
            <p><strong>Actualizado:</strong> ${new Date(data.fechaActualizacion).toLocaleString("es-AR")}</p>
        `;
    } catch (error) {
        console.error("Error al obtener la cotización:", error);
        const mainContent = document.querySelector(".main-content");
        mainContent.innerHTML = `<p>Error al obtener la cotización del dólar.</p>`;
    }
}

function citaForismatic() {
    const oldScript = document.getElementById("forismaticScript");
    if (oldScript) {
        oldScript.remove();
    }

    const callbackName = "forismaticCallback_" + Date.now();

    window[callbackName] = function(data) {
        const mainContent = document.querySelector(".main-content");
        mainContent.innerHTML = `
            <blockquote>"${data.quoteText}"</blockquote>
            <p><strong>- ${data.quoteAuthor || "Autor desconocido"}</strong></p>
        `;
        delete window[callbackName];
        script.remove();
    };

    const script = document.createElement("script");
    script.id = "forismaticScript";
    script.src = `https://api.forismatic.com/api/1.0/?method=getQuote&format=jsonp&lang=en&jsonp=${callbackName}`;
    document.body.appendChild(script);
}