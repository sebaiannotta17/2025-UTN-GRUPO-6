document.addEventListener("DOMContentLoaded", async () => {
  const $categoriaSelect = document.getElementById("categoria");
  const $subcategoriaContainer = document.getElementById(
    "subcategoria-container",
  );
  const $form = document.getElementById("form-material");
  const API_BASE = "http://localhost:3000/api";

  // Verificar usuario logueado
  const usuarioLocal = JSON.parse(localStorage.getItem("user"));
  if (!usuarioLocal || !usuarioLocal.id) {
    window.alert("Usuario no logueado. Redirigiendo a login.");
    window.location.href = "login.html";
    return;
  }

  // Cargar categorias
  let categorias = [];
  try {
    const resp = await fetch(`${API_BASE}/categorias`, { cache: "no-store" });
    console.log("[carga] GET /api/categorias status:", resp.status);
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    categorias = await resp.json();
    console.log("[carga] categorias:", categorias);
  } catch (err) {
    console.error("[carga] Error cargando categorias:", err);
    categorias = []; // fallback vacío
  }

  if ($categoriaSelect) {
    $categoriaSelect.innerHTML =
      '<option value="">Seleccionar categoría</option>';
    categorias.forEach((cat) => {
      const opt = document.createElement("option");
      opt.value = cat.id;
      opt.textContent = cat.nombre;
      $categoriaSelect.appendChild(opt);
    });
  } else {
    console.error("[carga] No se encontró element #categoria en el DOM");
  }

  // Mostrar subcategorias
  $categoriaSelect?.addEventListener("change", (e) => {
    const catId = parseInt(e.target.value);
    const categoria = categorias.find((c) => c.id === catId);
    $subcategoriaContainer.innerHTML = "";

    if (!categoria || !categoria.subcategorias) return;

    mostrarSubcategoriasAgrupadas(categoria.subcategorias, categoria.nombre);
  });

  function labelFriendly(key) {
    const map = {
      tipo: "Tipo",
      acabado: "Acabado",
      uso: "Uso",
      elemento: "Elemento",
      material: "Material",
      otros: "Otros",
    };
    return map[key] || key.charAt(0).toUpperCase() + key.slice(1);
  }

  function mostrarSubcategoriasAgrupadas(data, categoriaNombre) {
    $subcategoriaContainer.innerHTML = "";

    const subcategoriasGrouped = Array.isArray(data)
      ? data.reduce((acc, item) => {
          if (!acc[item.tipo]) acc[item.tipo] = [];
          acc[item.tipo].push(item);
          return acc;
        }, {})
      : data;

    const labelMap = {
      Pintura: ["Tipo de pintura", "Acabado"],
      "Baldosas y azulejos": ["Tipo", "Material"],
      Madera: ["Tipo de madera", "Calidad"],
      Ladrillos: ["Tipo de ladrillo", "Uso"],
      Plomería: ["Elemento", "Material"],
    };

    const prefer = ["tipo", "acabado", "uso", "elemento", "material", "otros"];
    const keys = Object.keys(subcategoriasGrouped).sort((a, b) => {
      const ai = prefer.indexOf(a),
        bi = prefer.indexOf(b);
      if (ai === -1 && bi === -1) return a.localeCompare(b);
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    });

    const labelsPersonalizados = labelMap[categoriaNombre] || [
      "Subcategoría 1",
      "Subcategoría 2",
    ];

    let created = 0;
    for (const tipo of keys) {
      if (created >= 2) break;
      const items = subcategoriasGrouped[tipo];
      if (!items || items.length === 0) continue;

      const label = document.createElement("label");
      label.textContent =
        labelsPersonalizados[created] || `Subcategoría ${created + 1}`;

      const select = document.createElement("select");
      select.name = created === 0 ? "subcategoria1_id" : "subcategoria2_id";
      select.id = select.name;
      select.dataset.tipo = tipo;
      select.required = true;
      select.innerHTML = `<option value="">Seleccionar ${label.textContent.toLowerCase()}</option>`;

      items.forEach((it) => {
        const opt = document.createElement("option");
        opt.value = it.id;
        opt.textContent = it.nombre;
        select.appendChild(opt);
      });

      $subcategoriaContainer.appendChild(label);
      $subcategoriaContainer.appendChild(select);
      created++;
    }
  }

  // Envio formulario (multipart/form-data, incluye archivo de imagen opcional)
  $form?.addEventListener("submit", async (ev) => {
    ev.preventDefault();

    const usuario = JSON.parse(localStorage.getItem("user"));
    if (!usuario || !usuario.id) {
      alert("Debés iniciar sesión (usuario no encontrado).");
      return;
    }

    const categoria_val = document.getElementById("categoria").value;
    const categoria_id = categoria_val ? parseInt(categoria_val) : null;
    if (!categoria_id) {
      alert("Seleccioná una categoría.");
      return;
    }

    const sub1El = document.querySelector("select[name='subcategoria1_id']");
    const sub2El = document.querySelector("select[name='subcategoria2_id']");

    const subcategoria1_id = sub1El && sub1El.value ? parseInt(sub1El.value) : null;
    const subcategoria2_id = sub2El && sub2El.value ? parseInt(sub2El.value) : null;

    if (subcategoria1_id && subcategoria2_id && subcategoria1_id === subcategoria2_id) {
      alert("No podés seleccionar la misma subcategoría en ambos campos.");
      return;
    }

    const titulo = (document.getElementById("nombre").value || "").trim();
    const descripcion = (document.getElementById("descripcion").value || "").trim();
    const precioVal = parseFloat(document.getElementById("precio").value) || 0;
    const cantidadVal = parseInt(document.getElementById("cantidad").value) || 0;

    if (!titulo || !descripcion || precioVal <= 0 || cantidadVal <= 0) {
      alert("Completá todos los campos obligatorios correctamente.");
      return;
    }

    const formData = new FormData();
    formData.append("usuario_id", usuario.id);
    formData.append("categoria_id", categoria_id);
    if (subcategoria1_id) formData.append("subcategoria1_id", subcategoria1_id);
    if (subcategoria2_id) formData.append("subcategoria2_id", subcategoria2_id);
    formData.append("titulo", titulo);
    formData.append("descripcion", descripcion);
    formData.append("precio", precioVal);
    formData.append("cantidad", cantidadVal);

    const fileEl = document.getElementById("imagen");
    if (fileEl && fileEl.files && fileEl.files[0]) {
      formData.append("imagen", fileEl.files[0]);
    }

    try {
      const resp = await fetch(`${API_BASE}/publicaciones`, {
        method: "POST",
        body: formData,
      });
      const body = await resp.json().catch(() => ({}));
      console.log("[carga] respuesta POST /publicaciones:", resp.status, body);

      if (!resp.ok) {
        alert(body.error || "Error al crear la publicación.");
        return;
      }

      alert("Publicación creada correctamente.");
      $form.reset();
      $subcategoriaContainer.innerHTML = "";
    } catch (err) {
      console.error("[carga] Error en POST publicaciones:", err);
      alert("Ocurrió un error al publicar. Mirá consola.");
    }
  });
});
