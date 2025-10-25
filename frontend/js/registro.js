document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-reg");
  const errorDiv = document.getElementById("form-error");
  const API_URL = "http://localhost:3000/api/auth/register";

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Limpieza de errores previos
    errorDiv.style.display = "none";
    errorDiv.textContent = "";
    document
      .querySelectorAll(".field-error")
      .forEach((el) => el.classList.remove("field-error"));

    // Captura de valores
    const nombre = form.elements["nombre"]?.value?.trim() || "";
    const email = form.elements["email"]?.value?.trim() || "";
    const pw1 = form.elements["pw1"]?.value || "";
    const pw2 = form.elements["pw2"]?.value || "";

    let hasError = false;

    // Validaciones frontend
    if (!nombre || !email || !pw1 || !pw2) {
      errorDiv.textContent = "Completá todos los campos.";
      errorDiv.style.display = "block";
      hasError = true;
    } else if (pw1 !== pw2) {
      errorDiv.textContent = "Las contraseñas no coinciden.";
      errorDiv.style.display = "block";
      document.getElementById("pw1").classList.add("field-error");
      document.getElementById("pw2").classList.add("field-error");
      hasError = true;
    } else if (pw1.length < 6) {
      errorDiv.textContent = "La contraseña debe tener al menos 6 caracteres.";
      errorDiv.style.display = "block";
      document.getElementById("pw1").classList.add("field-error");
      hasError = true;
    }

    if (hasError) return;

    // --- Envío al backend ---
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, email, password: pw1 }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        errorDiv.textContent =
          data.error || data.message || "Error al registrar usuario.";
        errorDiv.style.display = "block";
        return;
      }

      alert("Registro exitoso 🎉");
      location.href = "./login.html";
    } catch (err) {
      console.error("Error al conectar con el servidor:", err);
      errorDiv.textContent = "No se pudo conectar con el servidor.";
      errorDiv.style.display = "block";
    }
  });
});
