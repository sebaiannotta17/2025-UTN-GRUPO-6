document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const nombreEl = document.getElementById("nombre");
  const emailEl = document.getElementById("email");
  const fechaEl = document.getElementById("fecha");
  const statusEl = document.getElementById("status");
  // NUEVO: Elemento donde se mostrarán las publicaciones
  const $listaPublicaciones = document.getElementById("lista-publicaciones");

  const btnEdit = document.getElementById("btn-edit");
  const btnDelete = document.getElementById("btn-delete");
  const btnLogout = document.getElementById("btn-logout");

  const API_AUTH_URL = "http://localhost:3000/api/auth";
  // NUEVO: URL base para las publicaciones
  const API_BASE = "http://localhost:3000/api";

  // Mostrar datos del usuario
  if (!user) {
    alert("No hay sesión activa. Iniciá sesión nuevamente.");
    location.href = "./login.html";
    return;
  }

  nombreEl.textContent = user.nombre;
  emailEl.textContent = user.email;
  fechaEl.textContent = user.fecha_registro;

  // ============================================================
  // FUNCIÓN: Cargar publicaciones del usuario
  // ============================================================
  async function cargarPublicacionesUsuario(userId) {
    if (!$listaPublicaciones) {
      // Esto solo debería ocurrir si el DOM no carga la sección de publicaciones
      console.error("Elemento #lista-publicaciones no encontrado en el DOM.");
      return;
    }
    $listaPublicaciones.innerHTML = "<p>Cargando publicaciones...</p>";

    try {
      // Se hace un GET a /api/publicaciones filtrando por usuario_id
      const resp = await fetch(
        `${API_BASE}/publicaciones?usuario_id=${userId}`,
        { cache: "no-store" },
      );

      const json = await resp.json().catch(() => []);

      if (!resp.ok)
        throw new Error(json.error || `HTTP error! status: ${resp.status}`);

      if (!Array.isArray(json) || json.length === 0) {
        $listaPublicaciones.innerHTML = "<p>Aún no has publicado nada.</p>";
        return;
      }

      // Limpiar y poblar la lista (renderizado)
      $listaPublicaciones.innerHTML = "";
      json.forEach((m) => {
        const li = document.createElement("li");
        // Usamos la clase 'publicacion-card' para aplicar estilos
        li.classList.add("publicacion-card");
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
                `;
        $listaPublicaciones.appendChild(li);
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
