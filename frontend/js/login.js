const $form = document.getElementById("form-login");
const $btnCancelar = document.getElementById("btn-cancelar");
const $error = document.getElementById("form-error");
const API_URL = "http://localhost:3000/api/auth";

// Mostrar y limpiar error
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

// Envío del formulario
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
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      showError(body.error || body.message || "Credenciales incorrectas.");
      return;
    }

    const payload = await res.json();

    if (payload.usuario) {
      // Guardar usuario y su ID
      localStorage.setItem("user", JSON.stringify(payload.usuario));
      localStorage.setItem("userId", payload.usuario.id);

      location.href = "./main.html";
      return;
    }

    showError("No se pudo iniciar sesión. Intentalo de nuevo.");
  } catch (err) {
    console.error("Error de conexión:", err);
    showError("No se pudo conectar con el servidor. Intentalo más tarde.");
  }
});
