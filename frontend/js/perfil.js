document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const nombreEl = document.getElementById("nombre");
  const emailEl = document.getElementById("email");
  const fechaEl = document.getElementById("fecha");
  const statusEl = document.getElementById("status");
  const $listaPublicaciones = document.getElementById("lista-publicaciones");

  const btnEdit = document.getElementById("btn-edit");
  const btnDelete = document.getElementById("btn-delete");
  const btnLogout = document.getElementById("btn-logout");

  const API_AUTH_URL = "http://localhost:3000/api/auth";
  const API_BASE = "http://localhost:3000/api";
  const API_PUBLICACIONES = `${API_BASE}/publicaciones`;

  // --- Validar sesión ---
  if (!user) {
    alert("No hay sesión activa. Iniciá sesión nuevamente.");
    location.href = "./login.html";
    return;
  }

  // Mostrar datos del usuario
  nombreEl.textContent = user.nombre;
  emailEl.textContent = user.email;
  fechaEl.textContent = user.fecha_registro;

  // ============================================================
  // =============== MODAL EDITAR PERFIL ========================
  // ============================================================

  const $modal = document.getElementById("editProfileModal");
  const $form = document.getElementById("form-edit-profile");
  const $err = document.getElementById("ep-error");
  const $nombre = document.getElementById("ep-nombre");
  const $email = document.getElementById("ep-email");

  function openModal() {
    $modal.setAttribute("aria-hidden", "false");
    $modal.classList.add("open");
    document.body.classList.add("no-scroll");
    setTimeout(() => $nombre.focus(), 100);
  }

  function closeModal() {
    $modal.setAttribute("aria-hidden", "true");
    $modal.classList.remove("open");
    document.body.classList.remove("no-scroll");
    if ($err) {
      $err.style.display = "none";
      $err.textContent = "";
    }
  }

  $modal.addEventListener("click", (e) => {
    if (e.target.dataset.close === "1") closeModal();
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && $modal.classList.contains("open")) closeModal();
  });

  // Abrir modal con datos actuales
  btnEdit.addEventListener("click", () => {
    $nombre.value = user.nombre || "";
    $email.value = user.email || "";
    openModal();
  });

  // Guardar cambios del perfil
  $form.addEventListener("submit", async (ev) => {
    ev.preventDefault();

    const nuevoNombre = $nombre.value.trim();
    const nuevoEmail = $email.value.trim();

    if (!nuevoNombre || !nuevoEmail) {
      $err.textContent = "Completá nombre y email.";
      $err.style.display = "block";
      return;
    }

    try {
      const res = await fetch(`${API_AUTH_URL}/update/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: nuevoNombre, email: nuevoEmail }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message);

      // Actualizar info local y UI
      user.nombre = nuevoNombre;
      user.email = nuevoEmail;
      localStorage.setItem("user", JSON.stringify(user));

      nombreEl.textContent = nuevoNombre;
      emailEl.textContent = nuevoEmail;
      statusEl.textContent = "Perfil actualizado correctamente ✅";
      statusEl.style.color = "green";

      closeModal();
    } catch (err) {
      console.error(err);
      $err.textContent = "Error al actualizar perfil.";
      $err.style.display = "block";
    }
  });

  // ============================================================
  // =============== MODAL ELIMINAR CUENTA ======================
  // ============================================================

  const $modalDel = document.getElementById("deleteAccountModal");
  const $formDel = document.getElementById("form-delete-account");
  const $errDel = document.getElementById("del-error");
  const $passDel = document.getElementById("del-password");
  const $passToggle = document.querySelector('#deleteAccountModal .password-toggle');

  function openDeleteModal() {
    $modalDel.setAttribute("aria-hidden", "false");
    $modalDel.classList.add("open");
    document.body.classList.add("no-scroll");
    setTimeout(() => $passDel.focus(), 100);
  }

  function closeDeleteModal() {
    $modalDel.setAttribute("aria-hidden", "true");
    $modalDel.classList.remove("open");
    document.body.classList.remove("no-scroll");
    if ($errDel) {
      $errDel.style.display = "none";
      $errDel.textContent = "";
    }
    $formDel.reset();
  }

  $modalDel.addEventListener("click", (e) => {
    if (e.target.dataset.close === "1") closeDeleteModal();
  });

  // Toggle mostrar/ocultar contraseña
  if ($passToggle) {
    $passToggle.addEventListener('click', () => {
      if ($passDel.type === 'password') {
        $passDel.type = 'text';
        $passToggle.textContent = '🙈';
        $passToggle.setAttribute('aria-label', 'Ocultar contraseña');
      } else {
        $passDel.type = 'password';
        $passToggle.textContent = '👁️';
        $passToggle.setAttribute('aria-label', 'Mostrar contraseña');
      }
      // mantener foco en el input
      $passDel.focus();
    });
  }

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && $modalDel.classList.contains("open"))
      closeDeleteModal();
  });

  // Botón "Eliminar cuenta" abre modal
  btnDelete.addEventListener("click", () => {
    openDeleteModal();
  });

  // Confirmar eliminación
  $formDel.addEventListener("submit", async (ev) => {
    ev.preventDefault();

    const password = $passDel.value.trim();
    if (!password) {
      $errDel.textContent = "Ingresá tu contraseña.";
      $errDel.style.display = "block";
      return;
    }

    try {
      const res = await fetch(`${API_AUTH_URL}/delete/${user.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message);

      alert("Cuenta eliminada correctamente.");
      localStorage.removeItem("user");
      closeDeleteModal();
      location.href = "./login.html";
    } catch (err) {
      console.error(err);
      $errDel.textContent =
        "Contraseña incorrecta o error al eliminar cuenta.";
      $errDel.style.display = "block";
    }
  });

  // ============================================================
  // ================ PUBLICACIONES =============================
  // ============================================================
  // --- Modales para editar y eliminar publicaciones (reemplazan prompt/confirm) ---
  const $editPubModal = document.getElementById("editPubModal");
  const $formEditPub = document.getElementById("form-edit-publicacion");
  const $epId = document.getElementById("ep-id");
  const $epTitulo = document.getElementById("ep-titulo");
  const $epDescripcion = document.getElementById("ep-descripcion");
  const $epPrecio = document.getElementById("ep-precio");
  const $epCantidad = document.getElementById("ep-cantidad");
  const $epImagen = document.getElementById("ep-imagen");
  const $epPubError = document.getElementById("ep-pub-error");
  const $epCategoria = document.getElementById("ep-categoria");
  const $epSub1 = document.getElementById("ep-sub1");
  const $epSub2 = document.getElementById("ep-sub2");

  const $deletePubModal = document.getElementById("deletePubModal");
  const $deletePubTitle = document.getElementById("delete-pub-title");
  const $confirmDeleteBtn = document.getElementById("confirm-delete-pub");
  const $epDeleteError = document.getElementById("ep-delete-error");
  let _pendingDeleteId = null;

  function openEditPubModal() {
    if (!$editPubModal) return;
    $editPubModal.setAttribute("aria-hidden", "false");
    $editPubModal.classList.add("open");
    document.body.classList.add("no-scroll");
    setTimeout(() => $epTitulo.focus(), 100);
  }

  function closeEditPubModal() {
    if (!$editPubModal) return;
    $editPubModal.setAttribute("aria-hidden", "true");
    $editPubModal.classList.remove("open");
    document.body.classList.remove("no-scroll");
    $formEditPub.reset();
    $epPubError.style.display = "none";
    $epPubError.textContent = "";
  }

  function openDeletePubModal(title, id) {
    if (!$deletePubModal) return;
    _pendingDeleteId = id;
    $deletePubTitle.textContent = `Eliminar publicación: "${title || "(sin título)"}"`;
    $deletePubModal.setAttribute("aria-hidden", "false");
    $deletePubModal.classList.add("open");
    document.body.classList.add("no-scroll");
  }

  function closeDeletePubModal() {
    if (!$deletePubModal) return;
    _pendingDeleteId = null;
    $deletePubModal.setAttribute("aria-hidden", "true");
    $deletePubModal.classList.remove("open");
    document.body.classList.remove("no-scroll");
    $epDeleteError.style.display = "none";
    $epDeleteError.textContent = "";
  }

  // Close modals on backdrop clicks
  $editPubModal?.addEventListener("click", (e) => {
    if (e.target.dataset.close === "1") closeEditPubModal();
  });
  $deletePubModal?.addEventListener("click", (e) => {
    if (e.target.dataset.close === "1") closeDeletePubModal();
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if ($editPubModal?.classList.contains("open")) closeEditPubModal();
      if ($deletePubModal?.classList.contains("open")) closeDeletePubModal();
    }
  });

  async function enviarEdicion(publicacionId, data, isFormData = false) {
    try {
      const opts = {
        method: "PUT",
        body: isFormData ? data : JSON.stringify(data),
        headers: {},
      };
      if (!isFormData) opts.headers["Content-Type"] = "application/json";

      const resp = await fetch(`${API_PUBLICACIONES}/${publicacionId}`, opts);
      const json = await resp.json().catch(() => ({}));
      if (!resp.ok) throw new Error(json.error || "Error al editar.");

      alert("Publicación actualizada exitosamente.");
      closeEditPubModal();
      cargarPublicacionesUsuario(user.id);
    } catch (err) {
      console.error("[Perfil] Error al enviar edición:", err);
      $epPubError.textContent = err.message || "Error al actualizar publicación.";
      $epPubError.style.display = "block";
    }
  }

  function editarPublicacion(publicacion) {
    // Prefill modal fields
    $epId.value = publicacion.id;
    $epTitulo.value = publicacion.titulo || "";
    $epDescripcion.value = publicacion.descripcion || "";
    $epPrecio.value = publicacion.precio ?? 0;
    $epCantidad.value = publicacion.cantidad ?? 0;
    $epCategoria.value = publicacion.categoria_id || "";
    $epSub1.value = publicacion.subcategoria1_id || "";
    $epSub2.value = publicacion.subcategoria2_id || "";
    $epImagen.value = "";
    openEditPubModal();
  }

  async function cargarPublicacionesUsuario(userId) {
    if (!$listaPublicaciones) return;
    $listaPublicaciones.innerHTML = "<p>Cargando publicaciones...</p>";

    try {
      const resp = await fetch(`${API_PUBLICACIONES}?usuario_id=${userId}`, {
        cache: "no-store",
      });

      const json = await resp.json().catch(() => []);
      if (!resp.ok)
        throw new Error(json.error || `HTTP error! status: ${resp.status}`);

      if (!Array.isArray(json) || json.length === 0) {
        $listaPublicaciones.innerHTML = "<p>Aún no has publicado nada.</p>";
        return;
      }

      $listaPublicaciones.innerHTML = "";
      json.forEach((m) => {
        const li = document.createElement("li");
        li.classList.add("publicacion-card");
        li.dataset.publicacion = JSON.stringify(m);
        li.innerHTML = `
          <div class="card-content">
            <h3>${m.titulo || "Sin título"}</h3>
            <p>${m.descripcion || "Sin descripción."}</p>
            <p><strong>Precio:</strong> $${m.precio ?? 0}</p>
            <p><strong>Cantidad:</strong> ${m.cantidad ?? 0}</p>
            <p class="meta">
              Categoría: ${m.categoria_nombre || "N/A"}
              <br>
              Subcategoría 1: ${m.subcategoria1_nombre || "N/A"}
            </p>
            ${
              m.imagen
                ? `<img src="${m.imagen}" alt="${m.titulo}" class="publicacion-img" />`
                : ""
            }
          </div>
          <div class="publicacion-actions">
            <button class="btn-edit-pub btn-outline" data-id="${m.id}">Editar</button>
            <button class="btn-delete-pub btn-danger" data-id="${m.id}">Eliminar</button>
          </div>
        `;
        $listaPublicaciones.appendChild(li);
      });

      $listaPublicaciones.querySelectorAll(".btn-edit-pub").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const li = e.target.closest("li");
          const data = JSON.parse(li.dataset.publicacion);
          editarPublicacion(data);
        });
      });

      $listaPublicaciones.querySelectorAll(".btn-delete-pub").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const li = e.target.closest("li");
          const data = JSON.parse(li.dataset.publicacion);
          openDeletePubModal(data.titulo, data.id);
        });
      });
    } catch (err) {
      console.error("[Perfil] Error cargando publicaciones:", err);
      $listaPublicaciones.innerHTML =
        "<p>Error al cargar tus publicaciones.</p>";
    }
  }

  cargarPublicacionesUsuario(user.id);

  // manejar submit del form de editar publicación
  $formEditPub?.addEventListener("submit", async (ev) => {
    ev.preventDefault();
    const id = $epId.value;
    const titulo = $epTitulo.value.trim();
    const descripcion = $epDescripcion.value.trim();
    const precio = parseFloat($epPrecio.value) || 0;
    const cantidad = parseInt($epCantidad.value) || 0;

    if (!titulo || !descripcion || precio <= 0 || cantidad < 0) {
      $epPubError.textContent = "Completá los campos obligatorios correctamente.";
      $epPubError.style.display = "block";
      return;
    }

    const formData = new FormData();
    formData.append("titulo", titulo);
    formData.append("descripcion", descripcion);
    formData.append("precio", precio);
    formData.append("cantidad", cantidad);
  // include category/subcategory ids to avoid nulling required fields
  if ($epCategoria && $epCategoria.value) formData.append("categoria_id", $epCategoria.value);
  if ($epSub1 && $epSub1.value) formData.append("subcategoria1_id", $epSub1.value);
  if ($epSub2 && $epSub2.value) formData.append("subcategoria2_id", $epSub2.value);
    // allow replacing image
    if ($epImagen.files && $epImagen.files[0]) formData.append("imagen", $epImagen.files[0]);

    await enviarEdicion(id, formData, true);
  });

  // Confirmar eliminación desde modal
  $confirmDeleteBtn?.addEventListener("click", async () => {
    if (!_pendingDeleteId) return;
    try {
      const resp = await fetch(`${API_PUBLICACIONES}/${_pendingDeleteId}`, { method: "DELETE" });
      const json = await resp.json().catch(() => ({}));
      if (!resp.ok) throw new Error(json.error || "Error al eliminar.");

      alert("Publicación eliminada exitosamente.");
      closeDeletePubModal();
      cargarPublicacionesUsuario(user.id);
    } catch (err) {
      console.error("[Perfil] Error al eliminar publicación:", err);
      $epDeleteError.textContent = err.message || "Error al eliminar publicación.";
      $epDeleteError.style.display = "block";
    }
  });

  // ============================================================
  // =================== CERRAR SESIÓN ==========================
  // ============================================================

  btnLogout.addEventListener("click", () => {
    localStorage.removeItem("user");
    location.href = "./login.html";
  });
});
