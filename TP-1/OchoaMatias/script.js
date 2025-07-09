// Frases aleatorias
const frases = [
  "CSS es un lenguaje de hojas de estilo que define la apariencia de un documento HTML.",
  "JavaScript es un lenguaje de programación que permite implementar funciones complejas en páginas web.",
  "HTML es un lenguaje de etiquetas que define la estructura de un documento web.",
];

function mostrarFraseAleatoria() {
  const randomIndex = Math.floor(Math.random() * frases.length);
  const frase = frases[randomIndex];
  const fraseDiv = document.getElementById("random-phrase");
  fraseDiv.textContent = frase;
  fraseDiv.className = "random-phrase variant" + (randomIndex + 1);
}

window.addEventListener("DOMContentLoaded", mostrarFraseAleatoria);

// Lógica para traer datos de Wikipedia
const wikiLink = document.getElementById("wiki-link");
const apiContent = document.getElementById("api-content");
const descripcion = document.querySelector(".description");
const randomPhraseDiv = document.getElementById("random-phrase");
const gutenLink = document.getElementById("guten-link");

wikiLink.addEventListener("click", async function (e) {
  e.preventDefault();
  // Ocultar la descripción principal y la frase aleatoria
  if (descripcion) descripcion.style.display = "none";
  if (randomPhraseDiv) randomPhraseDiv.style.display = "none";
  apiContent.innerHTML = "<p>Cargando información de Wikipedia...</p>";

  try {
    // 1. Traer resumen y datos de la página de Boca Juniors
    const summaryRes = await fetch(
      "https://es.wikipedia.org/api/rest_v1/page/summary/Club_Atlético_Boca_Juniors"
    );
    const summaryData = await summaryRes.json();

    // 2. Traer la lista de títulos desde la sección de "Palmarés" (usando la API de parse)
    const parseRes = await fetch(
      "https://es.wikipedia.org/w/api.php?action=parse&page=Club_Atl%C3%A9tico_Boca_Juniors&prop=sections&format=json&origin=*"
    );
    const parseData = await parseRes.json();
    const secciones = parseData.parse.sections;
    const palmaresSection = secciones.find((sec) =>
      sec.line.toLowerCase().includes("palmarés")
    );
    let titulosHTML = "";
    if (palmaresSection) {
      // Obtener el índice de la sección de palmarés
      const palmaresIndex = palmaresSection.index;
      // Traer el contenido de esa sección
      const palmaresContentRes = await fetch(
        `https://es.wikipedia.org/w/api.php?action=parse&page=Club_Atl%C3%A9tico_Boca_Juniors&section=${palmaresIndex}&prop=text&format=json&origin=*`
      );
      const palmaresContentData = await palmaresContentRes.json();
      titulosHTML = palmaresContentData.parse.text["*"];
    } else {
      titulosHTML = "<p>No se pudo obtener la lista de títulos.</p>";
    }

    const imagen = summaryData.originalimage
      ? summaryData.originalimage.source
      : summaryData.thumbnail
      ? summaryData.thumbnail.source
      : "";

    apiContent.innerHTML = `
      <h2>${summaryData.title}</h2>
      <img src="${imagen}" alt="Boca Juniors" style="max-width:300px; border-radius:8px; margin-bottom:12px;" />
      <p>${summaryData.extract}</p>
      <h3>Títulos ganados</h3>
      <div>${titulosHTML}</div>
    `;
  } catch (err) {
    apiContent.innerHTML = "<p>Error al obtener los datos de Wikipedia.</p>";
  }
});

gutenLink.addEventListener("click", async function (e) {
  e.preventDefault();
  if (descripcion) descripcion.style.display = "none";
  if (randomPhraseDiv) randomPhraseDiv.style.display = "none";
  apiContent.innerHTML = "<p>Cargando libros de Gutendex...</p>";

  try {
    // Buscar dos libros bestsellers
    const libros = ["Pride and Prejudice", "Dracula"];
    let resultados = [];
    for (const libro of libros) {
      const res = await fetch(
        `https://gutendex.com/books/?search=${encodeURIComponent(libro)}`
      );
      const data = await res.json();
      if (data.results && data.results.length > 0) {
        const book = data.results[0];
        resultados.push({
          title: book.title,
          author:
            book.authors && book.authors.length > 0
              ? book.authors[0].name
              : "Autor desconocido",
          cover: book.formats["image/jpeg"],
          link:
            book.formats["text/html; charset=utf-8"] ||
            book.formats["text/plain; charset=utf-8"] ||
            book.formats["application/pdf"],
          subjects: book.subjects ? book.subjects.slice(0, 3).join(", ") : "",
          lang: book.languages ? book.languages.join(", ") : "",
        });
      }
    }
    if (resultados.length > 0) {
      apiContent.innerHTML = resultados
        .map(
          (book) => `
      <div style="margin-bottom: 24px;">
        <h2>${book.title}</h2>
        <p><b>Autor:</b> ${book.author}</p>
        ${
          book.cover
            ? `<img src="${book.cover}" alt="${book.title}" style="max-width:180px; border-radius:8px; margin-bottom:8px;" />`
            : ""
        }
        <p><b>Temas:</b> ${book.subjects}</p>
        <p><b>Idioma(s):</b> ${book.lang}</p>
        <a href="${book.link}" target="_blank">Leer online</a>
      </div>
    `
        )
        .join("");
    } else {
      apiContent.innerHTML = "<p>No se encontraron libros populares.</p>";
    }
  } catch (err) {
    apiContent.innerHTML = "<p>Error al obtener los libros de Gutendex.</p>";
  }
});
