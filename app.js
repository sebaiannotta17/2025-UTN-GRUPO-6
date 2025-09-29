const form = document.getElementById("form-material");
const lista = document.getElementById("lista-materiales");
const btnCancelar = document.getElementById("btn-cancelar");
const toastContainer = document.getElementById("toast-container");
const selectCategoria = document.getElementById("categoria");
const subcatContainer = document.getElementById("subcategoria-container");

let materiales = [];

const categorias = {
  Pintura: {
    "Tipo de pintura": [
      "Plástica (látex): Para paredes de interior",
      "Esmalte: Para madera y metal",
      "Sintética: Para acabados resistentes",
      "Imprimación y selladora: Para preparar superficies",
      "Spray: Para acabados decorativos y pequeños objetos",
    ],
    Acabado: ["Mate", "Satinado", "Brillante"],
  },
  Ladrillos: {
    "Tipo de ladrillo": [
      "Cerámico (tradicional): Para muros",
      "Cara vista: Con acabado estético para fachadas",
      "Refractario: Para chimeneas y hornos",
    ],
  },
  "Baldosas y azulejos": {
    Material: [
      "Cerámica: Para pisos y paredes",
      "Gres porcelánico: Para zonas de alto tránsito",
      "Terracota: Para pisos rústicos",
    ],
    Uso: ["Piso", "Pared", "Exterior"],
  },
  Madera: {
    Tipo: [
      "Maciza: Viga, tabla, listón",
      "Aglomerado: MDF, contrachapado",
      "Listones: Para estructuras y marcos",
    ],
  },
  Plomería: {
    Material: ["PVC", "Cobre", "Polipropileno (PPR)"],
    Elemento: ["Tubos y caños", "Grifería y accesorios", "Conexiones"],
  },
};

selectCategoria.addEventListener("change", () => {
  const categoria = selectCategoria.value;
  subcatContainer.innerHTML = "";

  if (categoria && categorias[categoria]) {
    const opciones = categorias[categoria];
    Object.keys(opciones).forEach((grupo) => {
      const label = document.createElement("label");
      label.textContent = grupo;

      const select = document.createElement("select");
      select.name = grupo.toLowerCase().replace(/\s+/g, " ");

      select.required = true;
      select.innerHTML = `<option value="">Selecciona ${grupo}</option>`;

      opciones[grupo].forEach((opt) => {
        const option = document.createElement("option");
        option.value = opt;
        option.textContent = opt;
        select.appendChild(option);
      });

      subcatContainer.appendChild(label);
      subcatContainer.appendChild(select);
    });
  }
});

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const data = new FormData(form);
  const precio = parseFloat(data.get("precio"));
  const cantidad = parseInt(data.get("cantidad"));

  if (precio <= 0 || cantidad <= 0) {
    mostrarToast("⚠️ Precio y cantidad deben ser positivos", true);
    return;
  }

  const categoria = data.get("categoria");
  const detalles = {};
  for (let [key, value] of data.entries()) {
    if (
      !["nombre", "descripcion", "precio", "cantidad", "categoria"].includes(
        key,
      )
    ) {
      detalles[key] = value;
    }
  }

  const material = {
    nombre: data.get("nombre"),
    descripcion: data.get("descripcion"),
    precio,
    cantidad,
    categoria,
    detalles,
  };

  materiales.push(material);
  renderMateriales();
  mostrarToast("✅ Material publicado con éxito");
  form.reset();
  subcatContainer.innerHTML = "";
});

btnCancelar.addEventListener("click", () => {
  form.reset();
  subcatContainer.innerHTML = "";
});

function mostrarToast(mensaje, error = false) {
  const toast = document.createElement("div");
  toast.classList.add("toast");
  if (error) toast.classList.add("error");
  toast.innerText = mensaje;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}

function renderMateriales() {
  lista.innerHTML = "";
  materiales.forEach((m) => {
    const li = document.createElement("li");

    let detallesHTML = "<ul>";
    Object.keys(m.detalles).forEach((k) => {
      detallesHTML += `<li><strong>${k}:</strong> ${m.detalles[k]}</li>`;
    });
    detallesHTML += "</ul>";

    li.innerHTML = `
      <strong>${m.nombre}</strong><br>
      <em>Categoría:</em> ${m.categoria}<br>
      ${detallesHTML}
      ${m.descripcion}<br>
      <strong>Precio:</strong> $${m.precio} - <strong>Cantidad:</strong> ${m.cantidad}
    `;
    lista.appendChild(li);
  });
}
