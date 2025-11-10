// carrito.js - Funcionalidad del carrito de compras

const CarritoManager = {
  API_BASE: `${location.origin}/api`,
  
  // Inicializar carrito en una página
  init(usuario) {
    this.usuario = usuario;
    this.setupCarritoButton();
    this.setupModalListeners();
    this.actualizarContadorCarrito(); // Cargar contador inicial
    return this;
  },

  // Configurar visibilidad del botón de carrito
  setupCarritoButton() {
    const $btnCarrito = document.getElementById("btn-carrito");
    if ($btnCarrito) {
      $btnCarrito.style.display = this.usuario && this.usuario.id ? "inline-block" : "none";
    }
  },

  // Configurar listeners del modal del carrito
  setupModalListeners() {
    const $btnCarrito = document.getElementById("btn-carrito");
    const $modalCarrito = document.getElementById("modal-carrito");
    const $closeCarrito = document.getElementById("close-modal-carrito");

    // Abrir modal
    if ($btnCarrito) {
      $btnCarrito.addEventListener("click", () => {
        if (!this.usuario || !this.usuario.id) return;
        $modalCarrito.style.display = "flex";
        this.cargarCarrito();
      });
    }

    // Cerrar modal
    if ($closeCarrito) {
      $closeCarrito.addEventListener("click", () => {
        $modalCarrito.style.display = "none";
      });
    }

    // Cerrar modal al hacer click fuera
    if ($modalCarrito) {
      $modalCarrito.addEventListener("click", (e) => {
        if (e.target === $modalCarrito) {
          $modalCarrito.style.display = "none";
        }
      });
    }
  },

  // Agregar producto al carrito
  async agregarAlCarrito(publicacionId, cantidad = 1) {
    if (!this.usuario || !this.usuario.id) {
      this.mostrarMensaje("❌ Debes iniciar sesión para agregar al carrito", "error");
      return;
    }

    try {
      const res = await fetch(`${this.API_BASE}/carrito`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuario_id: this.usuario.id,
          publicacion_id: publicacionId,
          cantidad: cantidad
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al agregar al carrito");
      }

      this.mostrarMensaje("🛒 " + data.message, "success");
      this.actualizarContadorCarrito();

    } catch (error) {
      console.error("Error agregando al carrito:", error);
      this.mostrarMensaje("❌ " + error.message, "error");
    }
  },

  // Cargar items del carrito
  async cargarCarrito() {
    if (!this.usuario || !this.usuario.id) return;

    const $carritoGrid = document.getElementById("carrito-grid");
    const $carritoFeedback = document.getElementById("carrito-feedback");
    const $carritoTotal = document.getElementById("carrito-total");

    try {
      $carritoFeedback.textContent = "Cargando carrito...";
      $carritoFeedback.style.display = "block";
      $carritoGrid.innerHTML = "";

      const res = await fetch(`${this.API_BASE}/carrito/${this.usuario.id}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const carrito = await res.json();

      if (!Array.isArray(carrito) || carrito.length === 0) {
        $carritoFeedback.textContent = "Tu carrito está vacío.";
        $carritoTotal.textContent = "Total: $0";
        return;
      }

      $carritoFeedback.style.display = "none";
      $carritoGrid.innerHTML = carrito.map(item => this.itemCarritoHTML(item)).join("");

      // Calcular total
      const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad_carrito), 0);
      $carritoTotal.textContent = `Total: ${this.fmtCurrency(total)}`;

      // Agregar event listeners
      $carritoGrid.addEventListener("click", (e) => this.handleCarritoGridClick(e));

    } catch (err) {
      console.error("Error cargando carrito:", err);
      $carritoFeedback.textContent = "Error al cargar el carrito.";
    }
  },

  // Template para items del carrito
  itemCarritoHTML(item) {
    const imgHtml = item.imagen
      ? `<img src="${this.escapeHTML(item.imagen)}" alt="${this.escapeHTML(item.titulo)}" class="carrito-item-img" />`
      : `<div class="carrito-item-img-placeholder">📦</div>`;

    return `
      <li class="carrito-item" data-carrito-id="${item.carrito_id}">
        ${imgHtml}
        <div class="carrito-item-content">
          <h4>${this.escapeHTML(item.titulo)}</h4>
          <p class="carrito-item-price">${this.fmtCurrency(item.precio)} c/u</p>
          <p class="carrito-item-vendor">Vendedor: ${this.escapeHTML(item.vendedor_nombre)}</p>
          
          <div class="carrito-item-controls">
            <button class="btn-cantidad" data-action="decrease">−</button>
            <span class="cantidad-display">${item.cantidad_carrito}</span>
            <button class="btn-cantidad" data-action="increase">+</button>
            <button class="btn-eliminar-item" title="Eliminar del carrito">🗑️</button>
          </div>
          
          <div class="carrito-item-actions">
            <button class="btn-contactar-vendedor" data-pub-id="${item.publicacion_id}" title="Contactar vendedor">
              📞 Contactar Vendedor
            </button>
          </div>
          
          <p class="carrito-item-subtotal">
            Subtotal: ${this.fmtCurrency(item.precio * item.cantidad_carrito)}
          </p>
        </div>
      </li>
    `;
  },

  // Manejar clicks en el carrito
  async handleCarritoGridClick(e) {
    const carritoId = e.target.closest(".carrito-item")?.dataset.carritoId;
    if (!carritoId) return;

    // Botones de cantidad
    const btnCantidad = e.target.closest(".btn-cantidad");
    if (btnCantidad) {
      const action = btnCantidad.dataset.action;
      const cantidadDisplay = btnCantidad.parentElement.querySelector(".cantidad-display");
      const cantidadActual = parseInt(cantidadDisplay.textContent);
      
      let nuevaCantidad;
      if (action === "increase") {
        nuevaCantidad = cantidadActual + 1;
      } else if (action === "decrease" && cantidadActual > 1) {
        nuevaCantidad = cantidadActual - 1;
      } else {
        return;
      }

      await this.actualizarCantidadItem(carritoId, nuevaCantidad);
      return;
    }

    // Botón eliminar
    const btnEliminar = e.target.closest(".btn-eliminar-item");
    if (btnEliminar) {
      await this.eliminarItem(carritoId);
      return;
    }

    // Botón contactar vendedor
    const btnContactar = e.target.closest(".btn-contactar-vendedor");
    if (btnContactar) {
      e.preventDefault();
      e.stopPropagation();
      const publicacionId = btnContactar.dataset.pubId;
      if (publicacionId && window.VendedorManager) {
        window.VendedorManager.mostrarInfoVendedor(publicacionId);
      }
      return;
    }
  },

  // Actualizar cantidad de un item
  async actualizarCantidadItem(carritoId, cantidad) {
    try {
      const res = await fetch(`${this.API_BASE}/carrito/${carritoId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cantidad })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al actualizar cantidad");
      }

      this.mostrarMensaje("✅ Cantidad actualizada", "success");
      this.cargarCarrito(); // Recargar carrito
      this.actualizarContadorCarrito(); // Actualizar contador

    } catch (error) {
      console.error("Error actualizando cantidad:", error);
      this.mostrarMensaje("❌ " + error.message, "error");
    }
  },

  // Eliminar item del carrito
  async eliminarItem(carritoId) {
    try {
      const res = await fetch(`${this.API_BASE}/carrito/${carritoId}`, {
        method: 'DELETE'
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al eliminar item");
      }

      this.mostrarMensaje("🗑️ " + data.message, "removed");
      this.cargarCarrito(); // Recargar carrito
      this.actualizarContadorCarrito(); // Actualizar contador

    } catch (error) {
      console.error("Error eliminando item:", error);
      this.mostrarMensaje("❌ " + error.message, "error");
    }
  },

  // Actualizar contador del carrito
  async actualizarContadorCarrito() {
    if (!this.usuario || !this.usuario.id) {
      this.mostrarBadge(0);
      return;
    }

    try {
      const res = await fetch(`${this.API_BASE}/carrito/${this.usuario.id}`);
      if (!res.ok) {
        this.mostrarBadge(0);
        return;
      }

      const carrito = await res.json();
      const totalItems = carrito.reduce((total, item) => total + item.cantidad_carrito, 0);
      this.mostrarBadge(totalItems);

    } catch (error) {
      console.error("Error actualizando contador:", error);
      this.mostrarBadge(0);
    }
  },

  // Mostrar/ocultar badge con número
  mostrarBadge(cantidad) {
    const $badge = document.getElementById("carrito-badge");
    if (!$badge) return;

    if (cantidad > 0) {
      $badge.textContent = cantidad > 99 ? "99+" : cantidad.toString();
      $badge.style.display = "flex";
    } else {
      $badge.style.display = "none";
    }
  },

  // Mostrar mensaje temporal
  mostrarMensaje(texto, tipo) {
    let $toast = document.getElementById("toast-carrito");
    if (!$toast) {
      $toast = document.createElement("div");
      $toast.id = "toast-carrito";
      $toast.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 8px;
        font-weight: 500;
        z-index: 9999;
        transition: all 0.3s ease;
        transform: translateX(100%);
      `;
      document.body.appendChild($toast);
    }

    const estilos = {
      success: "background: #4CAF50; color: white;",
      removed: "background: #f44336; color: white;", 
      error: "background: #FF9800; color: white;"
    };

    $toast.textContent = texto;
    $toast.style.cssText += estilos[tipo] || estilos.error;
    
    setTimeout(() => {
      $toast.style.transform = "translateX(0)";
    }, 100);

    setTimeout(() => {
      $toast.style.transform = "translateX(100%)";
    }, 3000);
  },

  // Helpers
  escapeHTML(s) {
    return String(s ?? "")
      .replaceAll("&","&amp;")
      .replaceAll("<","&lt;")
      .replaceAll(">","&gt;")
      .replaceAll('"',"&quot;")
      .replaceAll("'","&#39;");
  },

  fmtCurrency(n) {
    const v = Number.isFinite(+n) ? +n : 0;
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0
    }).format(v);
  }
};

// Hacer disponible globalmente
window.CarritoManager = CarritoManager;