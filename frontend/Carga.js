document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-material");
  const toastContainer = document.getElementById("toast-container");
  const listaMateriales = document.getElementById("lista-materiales");
  const subcatContainer = document.getElementById("subcategoria-container");

  // ======== 1️⃣ CATEGORÍAS Y SUBCATEGORÍAS ========
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

  // ======== 2️⃣ CARGAR CATEGORÍAS ========
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

  // ======== 3️⃣ MOSTRAR SUBCATEGORÍAS ========
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

  // ======== 4️⃣ ENVÍO DEL FORMULARIO ========
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

  // ======== 5️⃣ MOSTRAR PUBLICACIONES ========
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

  // ======== 6️⃣ MENSAJE TOAST ========
  function mostrarToast(texto, error = false) {
    const toast = document.createElement("div");
    toast.className = "toast" + (error ? " error" : "");
    toast.textContent = texto;
    toastContainer.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }

  // ======== 7️⃣ BOTÓN CANCELAR ========
  document.getElementById("btn-cancelar").addEventListener("click", () => {
    form.reset();
    subcatContainer.innerHTML = "";
    mostrarToast("❌ Publicación cancelada", true);
  });

  // ======== Inicialización ========
  cargarCategorias();
  cargarPublicaciones();
});
