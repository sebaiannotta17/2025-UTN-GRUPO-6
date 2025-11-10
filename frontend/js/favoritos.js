// favoritos.js - Funcionalidad común de favoritos

const FavoritosManager = {
  API_BASE: `${location.origin}/api`,
  
  // Inicializar favoritos en una página
  init(usuario) {
    this.usuario = usuario;
    this.setupModalListeners();
    this.setupFavoritosButton();
    return this;
  },

  // Configurar listeners del modal
  setupModalListeners() {
    const $modalFavoritos = document.getElementById("modal-favoritos");
    const $closeFavoritos = document.getElementById("close-modal-favoritos");
    const $btnFavoritos = document.getElementById("btn-favoritos");

    // Abrir modal
    if ($btnFavoritos) {
      $btnFavoritos.addEventListener("click", () => {
        if (!this.usuario || !this.usuario.id) return;
        $modalFavoritos.style.display = "flex";
        this.cargarFavoritos();
      });
    }

    // Cerrar modal
    if ($closeFavoritos) {
      $closeFavoritos.addEventListener("click", () => {
        $modalFavoritos.style.display = "none";
      });
    }

    // Cerrar modal al hacer click fuera
    if ($modalFavoritos) {
      $modalFavoritos.addEventListener("click", (e) => {
        if (e.target === $modalFavoritos) {
          $modalFavoritos.style.display = "none";
        }
      });
    }
  },

  // Configurar visibilidad del botón de favoritos
  setupFavoritosButton() {
    const $btnFavoritos = document.getElementById("btn-favoritos");
    if ($btnFavoritos) {
      $btnFavoritos.style.display = this.usuario && this.usuario.id ? "inline-block" : "none";
    }
  },

  // Cargar favoritos del usuario
  async cargarFavoritos() {
    if (!this.usuario || !this.usuario.id) return;

    const $favoritosGrid = document.getElementById("favoritos-grid");
    const $favoritosFeedback = document.getElementById("favoritos-feedback");

    try {
      $favoritosFeedback.textContent = "Cargando favoritos...";
      $favoritosFeedback.style.display = "block";
      $favoritosGrid.innerHTML = "";

      const res = await fetch(`${this.API_BASE}/favoritos/${this.usuario.id}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const favoritos = await res.json();

      if (!Array.isArray(favoritos) || favoritos.length === 0) {
        $favoritosFeedback.textContent = "No tienes publicaciones favoritas aún.";
        return;
      }

      $favoritosFeedback.style.display = "none";
      $favoritosGrid.innerHTML = favoritos.map(fav => this.cardHTMLFavorito(fav)).join("");

      // Agregar event listener al grid de favoritos
      $favoritosGrid.addEventListener("click", (e) => this.handleFavoritosGridClick(e));

    } catch (err) {
      console.error("Error cargando favoritos:", err);
      $favoritosFeedback.textContent = "Error al cargar favoritos.";
    }
  },

  // Template para favoritos en el modal
  cardHTMLFavorito(fav) {
    const imgHtml = fav.imagen
      ? `<img src="${this.escapeHTML(fav.imagen)}" alt="${this.escapeHTML(fav.titulo || "Publicación")}" class="publicacion-img" />`
      : "";

    let fechaText = "";
    if (fav.fecha_publicacion) {
      try {
        const d = new Date(fav.fecha_publicacion);
        fechaText = d.toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' });
      } catch (e) {
        fechaText = fav.fecha_publicacion;
      }
    }

    const cantidad = (fav.cantidad !== undefined && fav.cantidad !== null) ? String(fav.cantidad) : "0";

    return `
      <li class="publicacion-card">
        ${imgHtml}
        <div class="card-content">
          <h3>${this.escapeHTML(fav.titulo || "Sin título")}</h3>
          <p class="muted">${this.escapeHTML(fav.descripcion || "Sin descripción.")}</p>
          <p class="card-price"><strong>${this.fmtCurrency(fav.precio)}</strong></p>
          <p class="card-meta">
            <span class="qty">Cantidad: ${this.escapeHTML(cantidad)}</span>
            <span class="date">${this.escapeHTML(fechaText)}</span>
          </p>
          <p class="card-vendor">Vendedor: ${this.escapeHTML(fav.vendedor_nombre || "")}</p>
        </div>
        <div class="publicacion-actions">
          <button class="btn btn-primary btn-view-pub"
                  data-id="${fav.id}"
                  data-titulo="${this.escapeHTML(fav.titulo || "")}">
            Ver detalle
          </button>
          <button class="btn-favorito favorito" data-pub-id="${fav.id}" title="Quitar de favoritos">⭐</button>
        </div>
      </li>
    `;
  },

  // Manejar clicks en el grid de favoritos
  handleFavoritosGridClick(e) {
    // Botón ver publicación
    const btnView = e.target.closest(".btn-view-pub");
    if (btnView) {
      const titulo = btnView.dataset.titulo || "";
      window.location.href = `./busqueda.html?q=${encodeURIComponent(titulo)}`;
      return;
    }

    // Botón favorito
    const btnFav = e.target.closest(".btn-favorito");
    if (btnFav) {
      this.toggleFavorito(btnFav);
      return;
    }
  },

  // Agregar botón de favorito a una tarjeta de publicación
  agregarBotonFavorito(publicacion) {
    if (!this.usuario || !this.usuario.id || this.usuario.id === publicacion.usuario_id) {
      return '';
    }
    return `<button class="btn-favorito" data-pub-id="${publicacion.id}" title="Agregar a favoritos">⭐</button>`;
  },

  // Toggle favorito
  async toggleFavorito(btn) {
    if (!this.usuario || !this.usuario.id) return;

    const pubId = btn.dataset.pubId;
    const esFavorito = btn.classList.contains("favorito");

    try {
      btn.disabled = true;
      
      const method = esFavorito ? "DELETE" : "POST";
      const res = await fetch(`${this.API_BASE}/favoritos`, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usuario_id: this.usuario.id,
          publicacion_id: pubId
        })
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({ error: "Error desconocido" }));
        throw new Error(error.error || "Error en la operación");
      }

      // Actualizar UI y mostrar mensaje
      if (esFavorito) {
        btn.classList.remove("favorito");
        btn.title = "Agregar a favoritos";
        this.mostrarMensaje("❌ Favorito removido", "removed");
        
        // Si estamos en el modal, quitar la tarjeta
        const $modalFavoritos = document.getElementById("modal-favoritos");
        if ($modalFavoritos && $modalFavoritos.style.display === "flex") {
          const card = btn.closest(".publicacion-card");
          if (card) {
            card.remove();
            // Verificar si quedan favoritos
            const $favoritosGrid = document.getElementById("favoritos-grid");
            const $favoritosFeedback = document.getElementById("favoritos-feedback");
            if ($favoritosGrid && $favoritosGrid.children.length === 0) {
              $favoritosFeedback.textContent = "No tienes publicaciones favoritas aún.";
              $favoritosFeedback.style.display = "block";
            }
          }
        }
      } else {
        btn.classList.add("favorito");
        btn.title = "Quitar de favoritos";
        this.mostrarMensaje("✅ Agregado a favoritos correctamente", "added");
      }

      // Recargar estados para asegurar consistencia
      setTimeout(() => {
        this.cargarEstadosFavoritos();
      }, 100);

    } catch (err) {
      console.error("Error toggle favorito:", err);
      this.mostrarMensaje("❌ Error: " + err.message, "error");
    } finally {
      btn.disabled = false;
    }
  },

  // Mostrar mensaje temporal
  mostrarMensaje(texto, tipo) {
    // Crear o reutilizar contenedor de mensajes
    let $toast = document.getElementById("toast-favoritos");
    if (!$toast) {
      $toast = document.createElement("div");
      $toast.id = "toast-favoritos";
      $toast.style.cssText = `
        position: fixed;
        top: 20px;
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

    // Estilos según el tipo
    const estilos = {
      added: "background: #4CAF50; color: white;",
      removed: "background: #f44336; color: white;", 
      error: "background: #FF9800; color: white;"
    };

    $toast.textContent = texto;
    $toast.style.cssText += estilos[tipo] || estilos.error;
    
    // Mostrar
    setTimeout(() => {
      $toast.style.transform = "translateX(0)";
    }, 100);

    // Ocultar después de 3 segundos
    setTimeout(() => {
      $toast.style.transform = "translateX(100%)";
    }, 3000);
  },

  // Cargar estado de favoritos para botones existentes
  async cargarEstadosFavoritos() {
    if (!this.usuario || !this.usuario.id) return;

    // Buscar TODOS los botones de favoritos, no solo los que no tienen clase favorito
    const botonesFav = document.querySelectorAll(".btn-favorito");
    console.log(`Cargando estados para ${botonesFav.length} botones de favoritos`);
    
    for (const btn of botonesFav) {
      const pubId = btn.dataset.pubId;
      if (!pubId) continue;
      
      try {
        const res = await fetch(`${this.API_BASE}/favoritos/check/${this.usuario.id}/${pubId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.esFavorito) {
            btn.classList.add("favorito");
            btn.title = "Quitar de favoritos";
            console.log(`✅ Publicación ${pubId} está en favoritos`);
          } else {
            btn.classList.remove("favorito");
            btn.title = "Agregar a favoritos";
            console.log(`⭐ Publicación ${pubId} NO está en favoritos`);
          }
        }
      } catch (err) {
        console.error("Error verificando favorito:", err);
      }
    }
  },

  // Event listener para manejar clicks en favoritos
  handleFavoritoClick(e) {
    const btnFav = e.target.closest(".btn-favorito");
    if (btnFav) {
      this.toggleFavorito(btnFav);
    }
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
window.FavoritosManager = FavoritosManager;