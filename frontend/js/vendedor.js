// Manejador para contactar vendedores
const VendedorManager = {
  API_BASE: "http://localhost:3000/api/vendedor",

  // Mostrar modal con información del vendedor
  async mostrarInfoVendedor(publicacionId) {
    try {
      const res = await fetch(`${this.API_BASE}/${publicacionId}`);
      
      if (!res.ok) {
        throw new Error('Error al obtener información del vendedor');
      }

      const vendedor = await res.json();
      this.abrirModalVendedor(vendedor);

    } catch (error) {
      console.error("Error obteniendo vendedor:", error);
      alert("Error al obtener información del vendedor");
    }
  },

  // Abrir modal con la información del vendedor
  abrirModalVendedor(vendedor) {
    // Crear modal dinámicamente si no existe
    let modal = document.getElementById('modal-vendedor');
    if (!modal) {
      modal = this.crearModalVendedor();
      document.body.appendChild(modal);
    }

    // Llenar información del vendedor
    document.getElementById('vendedor-nombre').textContent = vendedor.nombre;
    document.getElementById('vendedor-email').textContent = vendedor.email;
    document.getElementById('vendedor-celular').textContent = vendedor.celular || 'No especificado';
    document.getElementById('vendedor-publicaciones').textContent = vendedor.total_publicaciones;
    
    // Calcular tiempo en la plataforma
    const fechaRegistro = new Date(vendedor.fecha_registro);
    const tiempoEnPlataforma = this.calcularTiempoEnPlataforma(fechaRegistro);
    document.getElementById('vendedor-tiempo').textContent = tiempoEnPlataforma;

    // Configurar links de contacto
    const emailBtn = document.getElementById('contacto-email');
    const whatsappLink = document.getElementById('contacto-whatsapp');
    
    // Configurar botón de email para copiar
    emailBtn.onclick = () => this.copiarEmail(vendedor.email);
    
    if (vendedor.celular) {
      whatsappLink.href = `https://wa.me/${vendedor.celular.replace(/\D/g, '')}`;
      whatsappLink.style.display = 'inline-block';
    } else {
      whatsappLink.style.display = 'none';
    }

    // Mostrar modal
    modal.style.display = 'flex';
  },

  // Crear estructura del modal
  crearModalVendedor() {
    const modalHtml = `
      <div id="modal-vendedor" class="modal" style="display: none;">
        <div class="modal-content vendedor-modal">
          <div class="modal-header">
            <h2>📞 Contactar Vendedor</h2>
            <span class="close" id="close-modal-vendedor">&times;</span>
          </div>
          
          <div class="modal-body">
            <div class="vendedor-info">
              <div class="vendedor-avatar">
                <div class="avatar-placeholder">👤</div>
              </div>
              
              <div class="vendedor-datos">
                <h3 id="vendedor-nombre">Nombre del Vendedor</h3>
                <div class="vendedor-stats">
                  <p><strong>📧 Email:</strong> <span id="vendedor-email"></span></p>
                  <p><strong>📱 Celular:</strong> <span id="vendedor-celular"></span></p>
                  <p><strong>📦 Publicaciones:</strong> <span id="vendedor-publicaciones"></span></p>
                  <p><strong>🕒 En la plataforma:</strong> <span id="vendedor-tiempo"></span></p>
                </div>
              </div>
            </div>

            <div class="contacto-buttons">
              <button id="contacto-email" class="btn btn-primary">
                📧 Copiar Email
              </button>
              <a id="contacto-whatsapp" class="btn btn-success" target="_blank">
                💬 WhatsApp
              </a>
            </div>

            <div class="contacto-info">
              <p><strong>💡 Tip:</strong> Al contactar al vendedor, menciona que vienes de MaterialesYA y especifica qué producto te interesa.</p>
            </div>
          </div>
        </div>
      </div>
    `;

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = modalHtml;
    const modal = tempDiv.firstElementChild;

    // Agregar event listeners
    const closeBtn = modal.querySelector('#close-modal-vendedor');
    closeBtn.addEventListener('click', () => {
      modal.style.display = 'none';
    });

    // Cerrar modal al hacer click fuera
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.style.display = 'none';
      }
    });

    return modal;
  },

  // Calcular tiempo en la plataforma
  calcularTiempoEnPlataforma(fechaRegistro) {
    const ahora = new Date();
    const diffTime = Math.abs(ahora - fechaRegistro);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffMonths / 12);

    if (diffYears > 0) {
      return `${diffYears} año${diffYears > 1 ? 's' : ''}`;
    } else if (diffMonths > 0) {
      return `${diffMonths} mes${diffMonths > 1 ? 'es' : ''}`;
    } else if (diffDays > 0) {
      return `${diffDays} día${diffDays > 1 ? 's' : ''}`;
    } else {
      return 'Nuevo';
    }
  },

  // Copiar email al portapapeles
  async copiarEmail(email) {
    try {
      await navigator.clipboard.writeText(email);
      this.mostrarNotificacion('📧 Email copiado al portapapeles', 'success');
    } catch (error) {
      // Fallback para navegadores que no soportan clipboard API
      this.copiarEmailFallback(email);
    }
  },

  // Fallback para copiar email (navegadores antiguos)
  copiarEmailFallback(email) {
    const textArea = document.createElement('textarea');
    textArea.value = email;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    this.mostrarNotificacion('📧 Email copiado: ' + email, 'success');
  },

  // Mostrar notificación temporal
  mostrarNotificacion(mensaje, tipo = 'info') {
    // Crear o obtener contenedor de notificaciones
    let container = document.getElementById('notification-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'notification-container';
      container.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        pointer-events: none;
      `;
      document.body.appendChild(container);
    }

    // Crear notificación
    const notification = document.createElement('div');
    notification.style.cssText = `
      background: ${tipo === 'success' ? '#4CAF50' : '#2196F3'};
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      margin-bottom: 10px;
      font-weight: 500;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      transform: translateX(100%);
      transition: transform 0.3s ease;
      pointer-events: auto;
    `;
    notification.textContent = mensaje;

    container.appendChild(notification);

    // Animar entrada
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 10);

    // Animar salida y remover
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);
  },

  // Manejar click en botón contactar vendedor
  handleContactarVendedor(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const btn = e.target.closest('.btn-contactar-vendedor');
    if (!btn) return;

    const publicacionId = btn.dataset.pubId;
    if (publicacionId) {
      this.mostrarInfoVendedor(publicacionId);
    }
  }
};

// Función global para usar desde el HTML
window.contactarVendedor = (publicacionId) => {
  VendedorManager.mostrarInfoVendedor(publicacionId);
};

// Hacer VendedorManager disponible globalmente
window.VendedorManager = VendedorManager;