
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form-material');
  const categoriaSelect = document.getElementById('categoria');
  const subcategoriaContainer = document.getElementById('subcategoria-container');
  const btnCancelar = document.getElementById('btn-cancelar');
  const listaMateriales = document.getElementById('lista-materiales');

  const TOAST_CONTAINER = document.getElementById("toast-container");


  const subcategorias = {
    '1': ['Acrílica', 'Latex', 'Esmalte'], // Pintura
    '2': ['Común', 'Hueco 8', 'Hueco 12'], // Ladrillos
  };

  // Función de notificaciones 
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


  // Lógica de Publicación
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
    newItem.className = 'material-card';
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
    }
  });


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
