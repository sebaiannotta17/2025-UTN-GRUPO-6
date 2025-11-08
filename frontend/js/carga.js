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
    showToast("Usuario no logueado. Redirigiendo a login.", "error");
    setTimeout(() => {
      window.location.href = "login.html";
    }, 2000);
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
      label.innerHTML = `${labelsPersonalizados[created] || `Subcategoría ${created + 1}`} <span class="required">*</span>`;

      const select = document.createElement("select");
      select.name = created === 0 ? "subcategoria1_id" : "subcategoria2_id";
      select.id = select.name;
      select.dataset.tipo = tipo;
      select.required = true;
      select.innerHTML = `<option value="">Seleccionar ${labelsPersonalizados[created] || `subcategoría ${created + 1}`}</option>`;

      items.forEach((it) => {
        const opt = document.createElement("option");
        opt.value = it.id;
        opt.textContent = it.nombre;
        select.appendChild(opt);
      });

      const fieldDiv = document.createElement("div");
      fieldDiv.className = "form-field";
      
      const errorDiv = document.createElement("div");
      errorDiv.className = "error-message";
      errorDiv.id = `error-${select.name}`;

      fieldDiv.appendChild(label);
      fieldDiv.appendChild(select);
      fieldDiv.appendChild(errorDiv);
      
      $subcategoriaContainer.appendChild(fieldDiv);
      created++;
    }
  }

  // Envio formulario (multipart/form-data, incluye archivo de imagen opcional)
  $form?.addEventListener("submit", async (ev) => {
    ev.preventDefault();

    // Limpiar errores previos
    clearAllErrors();

    const usuario = JSON.parse(localStorage.getItem("user"));
    if (!usuario || !usuario.id) {
      showToast("Debés iniciar sesión para publicar.", "error");
      return;
    }

    // Validar todos los campos
    let hasErrors = false;

    const titulo = document.getElementById("nombre").value.trim();
    if (!titulo) {
      showFieldError("nombre", "El nombre del material es obligatorio");
      hasErrors = true;
    } else if (titulo.length < 3) {
      showFieldError("nombre", "El nombre debe tener al menos 3 caracteres");
      hasErrors = true;
    }

    const descripcion = document.getElementById("descripcion").value.trim();
    // Descripción opcional, pero si se completa debe tener al menos 10 caracteres
    if (descripcion && descripcion.length < 10) {
      showFieldError("descripcion", "Si agregás una descripción, debe tener al menos 10 caracteres");
      hasErrors = true;
    }

    const categoria_val = document.getElementById("categoria").value;
    const categoria_id = categoria_val ? parseInt(categoria_val) : null;
    if (!categoria_id) {
      showFieldError("categoria", "Seleccioná una categoría");
      hasErrors = true;
    }

    const sub1El = document.querySelector("select[name='subcategoria1_id']");
    const sub2El = document.querySelector("select[name='subcategoria2_id']");

    const subcategoria1_id = sub1El && sub1El.value ? parseInt(sub1El.value) : null;
    const subcategoria2_id = sub2El && sub2El.value ? parseInt(sub2El.value) : null;

    if (sub1El && !subcategoria1_id) {
      showFieldError("subcategoria1_id", "Seleccioná una opción");
      hasErrors = true;
    }

    if (sub2El && !subcategoria2_id) {
      showFieldError("subcategoria2_id", "Seleccioná una opción");
      hasErrors = true;
    }

    if (subcategoria1_id && subcategoria2_id && subcategoria1_id === subcategoria2_id) {
      showFieldError("subcategoria2_id", "No podés seleccionar la misma subcategoría dos veces");
      hasErrors = true;
    }

    const precioVal = parseFloat(document.getElementById("precio").value) || 0;
    if (precioVal <= 0) {
      showFieldError("precio", "El precio debe ser mayor a 0");
      hasErrors = true;
    }

    const cantidadVal = parseInt(document.getElementById("cantidad").value) || 0;
    if (cantidadVal <= 0) {
      showFieldError("cantidad", "La cantidad debe ser mayor a 0");
      hasErrors = true;
    }

    // Si hay errores, no continuar
    if (hasErrors) {
      showToast("Corregí los errores antes de continuar", "error");
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
        showToast(body.error || "Error al crear la publicación", "error");
        return;
      }

      showToast("¡Publicación creada correctamente!", "success");
      $form.reset();
      $subcategoriaContainer.innerHTML = "";
      clearAllErrors();
    } catch (err) {
      console.error("[carga] Error en POST publicaciones:", err);
      showToast("Ocurrió un error al publicar. Intentá de nuevo.", "error");
    }
  });

  // ===== Funciones de validación y UI =====
  
  function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorDiv = document.getElementById(`error-${fieldId}`);
    
    if (field) {
      field.classList.add('error');
      field.classList.remove('success');
    }
    
    if (errorDiv) {
      errorDiv.textContent = message;
    }
  }

  function clearFieldError(fieldId) {
    const field = document.getElementById(fieldId);
    const errorDiv = document.getElementById(`error-${fieldId}`);
    
    if (field) {
      field.classList.remove('error');
      field.classList.add('success');
    }
    
    if (errorDiv) {
      errorDiv.textContent = '';
    }
  }

  function clearAllErrors() {
    const errorDivs = document.querySelectorAll('.error-message');
    const fields = document.querySelectorAll('input, textarea, select');
    
    errorDivs.forEach(div => div.textContent = '');
    fields.forEach(field => {
      field.classList.remove('error', 'success');
    });
  }

  function showToast(message, type = 'info') {
    // Crear o encontrar container
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    // Crear toast
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <span>${message}</span>
      <button class="toast-close" onclick="this.parentElement.remove()">&times;</button>
    `;

    container.appendChild(toast);

    // Mostrar con animación
    setTimeout(() => toast.classList.add('show'), 100);

    // Auto-remover después de 5 segundos
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 5000);
  }

  // Validación en tiempo real
  function setupRealTimeValidation() {
    const fields = [
      { id: 'nombre', minLength: 3 },
      { id: 'precio', type: 'number', min: 1 },
      { id: 'cantidad', type: 'number', min: 1 }
    ];

    fields.forEach(({ id, minLength, type, min }) => {
      const field = document.getElementById(id);
      if (!field) return;

      field.addEventListener('blur', () => {
        const value = field.value.trim();
        
        if (!value) {
          showFieldError(id, 'Este campo es obligatorio');
        } else if (minLength && value.length < minLength) {
          showFieldError(id, `Debe tener al menos ${minLength} caracteres`);
        } else if (type === 'number' && (parseFloat(value) < min || isNaN(parseFloat(value)))) {
          showFieldError(id, `Debe ser un número mayor a ${min - 1}`);
        } else {
          clearFieldError(id);
        }
      });

      field.addEventListener('input', () => {
        if (field.classList.contains('error')) {
          field.classList.remove('error');
          const errorDiv = document.getElementById(`error-${id}`);
          if (errorDiv) errorDiv.textContent = '';
        }
      });
    });

    // Validación para categoria
    const categoriaSelect = document.getElementById('categoria');
    if (categoriaSelect) {
      categoriaSelect.addEventListener('change', () => {
        if (categoriaSelect.value) {
          clearFieldError('categoria');
        } else {
          showFieldError('categoria', 'Seleccioná una categoría');
        }
      });
    }

    // Validación especial para descripción (opcional)
    const descripcionField = document.getElementById('descripcion');
    if (descripcionField) {
      descripcionField.addEventListener('blur', () => {
        const value = descripcionField.value.trim();
        if (value && value.length < 10) {
          showFieldError('descripcion', 'Si agregás una descripción, debe tener al menos 10 caracteres');
        } else {
          clearFieldError('descripcion');
        }
      });

      descripcionField.addEventListener('input', () => {
        if (descripcionField.classList.contains('error')) {
          descripcionField.classList.remove('error');
          const errorDiv = document.getElementById('error-descripcion');
          if (errorDiv) errorDiv.textContent = '';
        }
      });
    }
  }

  // Inicializar validación en tiempo real
  setupRealTimeValidation();

  // Botón cancelar
  const btnCancelar = document.getElementById('btn-cancelar');
  if (btnCancelar) {
    btnCancelar.addEventListener('click', () => {
      if (confirm('¿Estás seguro de que querés cancelar? Se perderán todos los datos ingresados.')) {
        window.location.href = './main.html';
      }
    });
  }
});
