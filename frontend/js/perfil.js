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

  // Mostrar datos del usuario
  if (!user) {
    alert("No hay sesión activa. Iniciá sesión nuevamente.");
    location.href = "./login.html";
    return;
  }

  nombreEl.textContent = user.nombre;
  emailEl.textContent = user.email;
  fechaEl.textContent = user.fecha_registro;

  // Función que maneja la eliminación
  async function eliminarPublicacion(publicacionId) {
    if (
      !confirm(
        "¿Estás seguro de que deseas eliminar esta publicación? Esta acción es irreversible.",
      )
    ) {
      return;
    }

    try {
      const resp = await fetch(`${API_PUBLICACIONES}/${publicacionId}`, {
        method: "DELETE",
      });

      const json = await resp.json();

      if (!resp.ok) throw new Error(json.error || "Error al eliminar.");

      alert("Publicación eliminada exitosamente.");
      // Recargar la lista después de la eliminación
      cargarPublicacionesUsuario(user.id);
    } catch (err) {
      console.error("[Perfil] Error al eliminar publicación:", err);
      alert(`Error al eliminar publicación: ${err.message}`);
    }
  }

  // Función que maneja la edición
  function editarPublicacion(publicacion) {
    const nuevoTitulo = prompt("Editar Título:", publicacion.titulo);
    const nuevaDescripcion = prompt(
      "Editar Descripción:",
      publicacion.descripcion,
    );
    const nuevoPrecio = prompt("Editar Precio:", publicacion.precio);

    if (!nuevoTitulo || !nuevaDescripcion || !nuevoPrecio) {
      alert("Edición cancelada o campos incompletos.");
      return;
    }

    // Preparar el objeto con los datos a enviar
    const publicacionActualizada = {
      titulo: nuevoTitulo,
      descripcion: nuevaDescripcion,
      precio: parseFloat(nuevoPrecio),
      cantidad: publicacion.cantidad,
      categoria_id: publicacion.categoria_id,
      subcategoria1_id: publicacion.subcategoria1_id || null,
      subcategoria2_id: publicacion.subcategoria2_id || null,
      imagen: publicacion.imagen || null,
    };

    enviarEdicion(publicacion.id, publicacionActualizada);
  }

  // Función auxiliar para enviar la edición al servidor
  async function enviarEdicion(publicacionId, data) {
    try {
      const resp = await fetch(`${API_PUBLICACIONES}/${publicacionId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await resp.json();

      if (!resp.ok) throw new Error(json.error || "Error al editar.");

      alert("Publicación actualizada exitosamente.");
      // Recargar la lista después de la actualización
      cargarPublicacionesUsuario(user.id);
    } catch (err) {
      console.error("[Perfil] Error al enviar edición:", err);
      alert(`Error al actualizar publicación: ${err.message}`);
    }
  }

  // Cargar publicaciones del usuario
  async function cargarPublicacionesUsuario(userId) {
    if (!$listaPublicaciones) {
      console.error("Elemento #lista-publicaciones no encontrado en el DOM.");
      return;
    }
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

      // Limpiar y poblar la lista
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
                        ${m.imagen ? `<img src="${m.imagen}" alt="${m.titulo}" class="publicacion-img" />` : ""}
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
          const id = e.target.dataset.id;
          eliminarPublicacion(id);
        });
      });
    } catch (err) {
      console.error("[Perfil] Error cargando publicaciones:", err);
      $listaPublicaciones.innerHTML =
        "<p>Error al cargar tus publicaciones.</p>";
    }
  }

  // Llamar a la función al inicio de la carga
  cargarPublicacionesUsuario(user.id);

  // Cerrar sesión
  btnLogout.addEventListener("click", () => {
    localStorage.removeItem("user");
    location.href = "./login.html";
  });

  // Editar perfil
  btnEdit.addEventListener("click", async () => {
    const nuevoNombre = prompt("Nuevo nombre:", user.nombre);
    const nuevoEmail = prompt("Nuevo email:", user.email);

    if (!nuevoNombre || !nuevoEmail) {
      alert("Los campos no pueden estar vacíos.");
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

      // Actualizar la info local
      user.nombre = nuevoNombre;
      user.email = nuevoEmail;
      localStorage.setItem("user", JSON.stringify(user));

      nombreEl.textContent = nuevoNombre;
      emailEl.textContent = nuevoEmail;
      statusEl.textContent = "Perfil actualizado correctamente ✅";
      statusEl.style.color = "green";
    } catch (err) {
      console.error(err);
      statusEl.textContent = "Error al actualizar perfil.";
      statusEl.style.color = "red";
    }
  });

  // Eliminar cuenta verificando contraseña
  btnDelete.addEventListener("click", async () => {
    const confirmDelete = confirm(
      "Esta acción eliminará tu cuenta permanentemente.\n¿Seguro que querés continuar?",
    );
    if (!confirmDelete) return;

    const password = prompt("Por favor, ingresá tu contraseña para confirmar:");
    if (!password) {
      alert("Operación cancelada: no ingresaste la contraseña.");
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
      location.href = "./login.html";
    } catch (err) {
      console.error(err);
      statusEl.textContent =
        "Contraseña incorrecta o error al eliminar cuenta.";
      statusEl.style.color = "red";
    }
  });
});
