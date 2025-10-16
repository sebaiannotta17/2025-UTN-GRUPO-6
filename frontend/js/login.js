// frontend/js/login.js
const $form = document.getElementById("form-login");
const $btnCancelar = document.getElementById("btn-cancelar");
const $error = document.getElementById("form-error");

// Config: permitir login local solo en desarrollo
const ALLOW_LOCAL_LOGIN = false; // Cambiá a true solo para test offline

// --- Mostrar / limpiar error ---
function showError(msg) {
  if (!$error) return;
  $error.textContent = msg || "Usuario o contraseña incorrectos.";
  $error.style.display = "block";
}
function clearError() {
  if ($error) $error.style.display = "none";
}

// Limpia error cuando el usuario escribe o cancela
$form.addEventListener("input", clearError);
$btnCancelar.addEventListener("click", () => {
  $form.reset();
  clearError();
});

// --- Envío del formulario ---
$form.addEventListener("submit", async (e) => {
  e.preventDefault();
  clearError();

  const data = new FormData($form);
  const email = (data.get("email") || "").trim();
  const password = data.get("password") || "";

  if (!email || !password) {
    showError("Completá email y contraseña.");
    return;
  }

  try {
    // Intento backend real
    const res = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    // Si el backend responde con error (401/403/500)
    if (!res.ok) {
      let apiMsg = "";
      try {
        const body = await res.json();
        apiMsg = body?.message || body?.error || "";
      } catch {}
      showError(apiMsg || "Usuario o contraseña incorrectos.");
      return; // No iniciar sesión (CA1)
    }

    // Si responde OK
    const payload = await res.json().catch(() => ({}));
    if (payload.token && payload.user) {
      localStorage.setItem("token", payload.token);
      localStorage.setItem("user", JSON.stringify(payload.user));
      location.href = "./busqueda.html";
      return;
    }

    // Si no llega payload válido, mostrar error
    showError("No se pudo iniciar sesión. Intentalo de nuevo.");
    return;

  } catch (err) {
    // Si el backend no responde
    if (ALLOW_LOCAL_LOGIN) {
      // Modo dev: login local solo con credenciales especiales
      const DEV_EMAIL = "test@local";
      const DEV_PASS = "1234";
      if (email === DEV_EMAIL && password === DEV_PASS) {
        const token = "local." + btoa(email) + ".token";
        const user = { id: Date.now(), email, name: "dev" };
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        location.href = "./busqueda.html";
        return;
      }
    }

    // En producción: no iniciar sesión y mostrar error claro (CA1 y CA2)
    showError("No se pudo conectar con el servidor. Intentalo más tarde.");
  }
});
