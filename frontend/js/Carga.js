/* document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-material");
  const toastContainer = document.getElementById("toast-container");
  const listaMateriales = document.getElementById("lista-materiales");
  const subcatContainer = document.getElementById("subcategoria-container");

  //CATEGORÍAS Y SUBCATEGORÍAS
  const categorias = {
    1: {
      nombre: "Pintura",
      sub1: {
        label: "Tipo de pintura",
        opciones: [
          "Plástica (látex)",
          "Esmalte",
          "Sintética",
          "Imprimación y selladora",
          "Spray",
        ],
      },
      sub2: {
        label: "Acabado",
        opciones: ["Mate", "Satinado", "Brillante"],
      },
    },
    2: {
      nombre: "Ladrillos",
      sub1: {
        label: "Tipo de ladrillo",
        opciones: ["Cerámico (tradicional)", "Cara vista", "Refractario"],
      },
    },
    3: {
      nombre: "Baldosas y azulejos",
      sub1: {
        label: "Material",
        opciones: ["Cerámica", "Gres porcelánico", "Terracota"],
      },
      sub2: {
        label: "Uso",
        opciones: ["Piso", "Pared", "Exterior"],
      },
    },
    4: {
      nombre: "Madera",
      sub1: {
        label: "Tipo",
        opciones: ["Maciza", "Aglomerado", "Listones"],
      },
    },
    5: {
      nombre: "Plomería",
      sub1: {
        label: "Material",
        opciones: ["PVC", "Cobre", "Polipropileno (PPR)"],
      },
      sub2: {
        label: "Elemento",
        opciones: ["Tubos y caños", "Grifería y accesorios", "Conexiones"],
      },
    },
  };

  //CARGAR CATEGORÍAS
  function cargarCategorias() {
    const selectCat = document.getElementById("categoria");
    selectCat.innerHTML =
      `<option value="">Seleccionar categoría</option>` +
      Object.entries(categorias)
        .map(([id, cat]) => `<option value="${id}">${cat.nombre}</option>`)
        .join("");

    selectCat.addEventListener("change", (e) => {
      mostrarSubcategorias(e.target.value);
    });
  }

  //MOSTRAR SUBCATEGORÍAS
  function mostrarSubcategorias(categoriaId) {
    subcatContainer.innerHTML = "";
    const categoria = categorias[categoriaId];
    if (!categoria) return;

    if (categoria.sub1) {
      const label1 = document.createElement("label");
      label1.textContent = categoria.sub1.label;
      const select1 = document.createElement("select");
      select1.name = "subcategoria1";
      select1.innerHTML =
        `<option value="">Seleccionar</option>` +
        categoria.sub1.opciones
          .map((opt, i) => `<option value="${i + 1}">${opt}</option>`)
          .join("");
      subcatContainer.append(label1, select1);
    }

    if (categoria.sub2) {
      const label2 = document.createElement("label");
      label2.textContent = categoria.sub2.label;
      const select2 = document.createElement("select");
      select2.name = "subcategoria2";
      select2.innerHTML =
        `<option value="">Seleccionar</option>` +
        categoria.sub2.opciones
          .map((opt, i) => `<option value="${i + 1}">${opt}</option>`)
          .join("");
      subcatContainer.append(label2, select2);
    }
  }

  //ENVÍO DEL FORMULARIO
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = new FormData(form);
    const precio = parseFloat(data.get("precio"));
    const cantidad = parseInt(data.get("cantidad"));
    const categoriaId = parseInt(data.get("categoria")) || null;
    const subcat1Id = parseInt(data.get("subcategoria1")) || null;
    const subcat2Id = parseInt(data.get("subcategoria2")) || null;

    if (precio <= 0 || cantidad <= 0) {
      mostrarToast("⚠️ Precio y cantidad deben ser positivos", true);
      return;
    }

    const material = {
      usuario_id: 1,
      categoria_id: categoriaId,
      subcategoria1_id: subcat1Id,
      subcategoria2_id: subcat2Id,
      titulo: data.get("nombre"),
      descripcion: data.get("descripcion"),
      precio,
      cantidad,
      imagen: null,
    };

    console.log("📤 Enviando material:", material);

    try {
      const res = await fetch("http://localhost:3000/api/publicaciones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(material),
      });
      const result = await res.json();

      if (result.success) {
        mostrarToast("✅ Material publicado con éxito");
        form.reset();
        subcatContainer.innerHTML = "";
        cargarPublicaciones();
      } else {
        mostrarToast("⚠️ Error al guardar la publicación", true);
      }
    } catch (err) {
      console.error("❌ Error al enviar:", err);
      mostrarToast("❌ Error al conectar con el servidor", true);
    }
  });

  //MOSTRAR PUBLICACIONES
  async function cargarPublicaciones() {
    try {
      const res = await fetch("http://localhost:3000/api/publicaciones");
      const data = await res.json();

      listaMateriales.innerHTML = data
        .map(
          (m) => `
        <li class="card">
          <div class="thumb" data-initial="${m.titulo[0] || "?"}"></div>
          <h3>${m.titulo}</h3>
          <p>${m.descripcion}</p>
          <p class="price">$${m.precio}</p>
          <p>Cantidad: ${m.cantidad}</p>
        </li>
      `,
        )
        .join("");
    } catch (err) {
      console.error("❌ Error al cargar publicaciones:", err);
    }
  }

  //MENSAJE TOAST
  function mostrarToast(texto, error = false) {
    const toast = document.createElement("div");
    toast.className = "toast" + (error ? " error" : "");
    toast.textContent = texto;
    toastContainer.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }

  //BOTÓN CANCELAR
  document.getElementById("btn-cancelar").addEventListener("click", () => {
    form.reset();
    subcatContainer.innerHTML = "";
    mostrarToast("❌ Publicación cancelada", true);
  });

  //Inicialización
  cargarCategorias();
  cargarPublicaciones();
});
 */

// Lógica de Carga.js (Mockup para la publicación de materiales)

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-material');
    const categoriaSelect = document.getElementById('categoria');
    const subcategoriaContainer = document.getElementById('subcategoria-container');
    const btnCancelar = document.getElementById('btn-cancelar');
    const listaMateriales = document.getElementById('lista-materiales');

    const TOAST_CONTAINER = document.getElementById("toast-container");

    // Datos de ejemplo para subcategorías (Mock)
    const subcategorias = {
        '1': ['Acrílica', 'Latex', 'Esmalte'], // Pintura
        '2': ['Común', 'Hueco 8', 'Hueco 12'], // Ladrillos
    };

    // Función de notificaciones Toast (copiada de recuperar.js para consistencia)
    function toast(message, isError = false) {
        const d = document.createElement("div");
        d.className = "toast" + (isError ? " error" : "");
        d.textContent = message;
        
        if (TOAST_CONTAINER) {
            TOAST_CONTAINER.appendChild(d);
            setTimeout(() => d.remove(), 3000);
        }
    }

    // --- Lógica de Subcategorías Dinámicas ---
    categoriaSelect.addEventListener('change', (e) => {
        const categoriaId = e.target.value;
        subcategoriaContainer.innerHTML = ''; // Limpiar contenido anterior

        if (subcategorias[categoriaId]) {
            const options = subcategorias[categoriaId]
                .map((name, index) => `<option value="${index + 1}">${name}</option>`)
                .join('');
            
            const html = `
                <label for="subcategoria">Subcategoría</label>
                <select name="subcategoria" id="subcategoria" required>
                    <option value="">Seleccionar subcategoría</option>
                    ${options}
                </select>
            `;
            subcategoriaContainer.innerHTML = html;
        }
    });


    // --- Lógica de Publicación (Submit) ---
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const data = new FormData(form);
        const nombre = data.get('nombre').trim();
        const precio = parseFloat(data.get('precio'));

        // Simulación de validación
        if (!nombre || precio <= 0) {
            toast('Por favor, completa todos los campos correctamente.', true);
            return;
        }

        // Simulación de carga exitosa
        toast(`Material "${nombre}" publicado exitosamente.`, false);
        
        // Simulación de añadir a la lista de cargados
        const newItem = document.createElement('li');
        newItem.className = 'material-card'; // Reutilizamos la clase de busqueda.css
        newItem.innerHTML = `
            <div class="card-thumb" style="background-color: #eee;">
                <span>${nombre.substring(0, 2).toUpperCase()}</span>
            </div>
            <div class="card-info" style="padding: 10px;">
                <h3 style="font-size: 1rem;">${nombre}</h3>
                <div class="card-price" style="font-size: 1.2rem; margin: 5px 0;">$${precio.toLocaleString('es-AR')}</div>
            </div>
        `;
        
        // Removemos el mensaje de placeholder si existe
        if (listaMateriales.querySelector('.muted')) {
            listaMateriales.innerHTML = '';
        }
        listaMateriales.prepend(newItem);
        
        form.reset();
        subcategoriaContainer.innerHTML = ''; // Limpiar subcategoría
    });

    // --- Lógica de Cancelar ---
    btnCancelar.addEventListener('click', () => {
        if (confirm('¿Estás seguro de que quieres cancelar la publicación y borrar los datos?')) {
             form.reset();
             subcategoriaContainer.innerHTML = '';
             toast('Publicación cancelada.', true);
             // Opcional: Redirigir al inicio o a la vista de productos
             // window.location.href = './main.html'; 
        }
    });


    // Estilos del toast (Necesario ya que el estilo CSS del toast no está en estiloMain.css)
    const style = document.createElement('style');
    style.textContent = `
        #toast-container {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 1000;
            display: flex;
            flex-direction: column;
            gap: 10px;
            pointer-events: none;
        }
        .toast {
            background-color: #4CAF50; /* Verde */
            color: white;
            padding: 10px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
            opacity: 0.95;
            font-weight: 600;
            transition: opacity 0.3s ease-in-out;
            min-width: 250px;
            text-align: center;
        }
        .toast.error {
            background-color: #e53935; /* Rojo */
        }
    `;
    document.head.appendChild(style);

});
