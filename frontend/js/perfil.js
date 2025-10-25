document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const nombreEl = document.getElementById("nombre");
  const emailEl = document.getElementById("email");
  const fechaEl = document.getElementById("fecha");
  const statusEl = document.getElementById("status");

  const btnEdit = document.getElementById("btn-edit");
  const btnDelete = document.getElementById("btn-delete");
  const btnLogout = document.getElementById("btn-logout");

  const API_URL = "http://localhost:3000/api/auth";

  // --- Mostrar datos del usuario ---
  if (!user) {
    alert("No hay sesión activa. Iniciá sesión nuevamente.");
    location.href = "./login.html";
    return;
  }

  nombreEl.textContent = user.nombre;
  emailEl.textContent = user.email;
  fechaEl.textContent = user.fecha_registro;

  // --- Cerrar sesión ---
  btnLogout.addEventListener("click", () => {
    localStorage.removeItem("user");
    location.href = "./login.html";
  });

  // --- Editar perfil ---
  btnEdit.addEventListener("click", async () => {
    const nuevoNombre = prompt("Nuevo nombre:", user.nombre);
    const nuevoEmail = prompt("Nuevo email:", user.email);

    if (!nuevoNombre || !nuevoEmail) {
      alert("Los campos no pueden estar vacíos.");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/update/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: nuevoNombre, email: nuevoEmail }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message);

      // Actualizamos la info local
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

  // --- Eliminar cuenta (con contraseña) ---
  btnDelete.addEventListener("click", async () => {
    const confirmDelete = confirm(
      "⚠️ Esta acción eliminará tu cuenta permanentemente.\n¿Seguro que querés continuar?",
    );
    if (!confirmDelete) return;

    const password = prompt("Por favor, ingresá tu contraseña para confirmar:");
    if (!password) {
      alert("Operación cancelada: no ingresaste la contraseña.");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/delete/${user.id}`, {
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
