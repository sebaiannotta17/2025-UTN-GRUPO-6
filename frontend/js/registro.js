// Lógica que maneja el formulario de registro
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-reg");
  const errorDiv = document.getElementById("form-error");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    errorDiv.style.display = "none";
    errorDiv.textContent = "";
    document
      .querySelectorAll(".field-error")
      .forEach((el) => el.classList.remove("field-error"));

    const name = form.elements["name"].value;
    const email = form.elements["email"].value;
    const password = form.elements["password"].value;
    const password2 = form.elements["password2"].value;

    let hasError = false;

    if (password !== password2) {
      errorDiv.textContent = "Las contraseñas no coinciden.";
      errorDiv.style.display = "block";
      document.getElementById("pw1").classList.add("field-error");
      document.getElementById("pw2").classList.add("field-error");
      hasError = true;
    }

    if (password.length < 6) {
      errorDiv.textContent = "La contraseña debe tener al menos 6 caracteres.";
      errorDiv.style.display = "block";
      document.getElementById("pw1").classList.add("field-error");
      hasError = true;
    }

    if (!hasError) {
      console.log("Usuario registrado con éxito:", { name, email, password });

      setTimeout(() => {
        console.log("Registro exitoso. Redirigiendo a Login...");
        location.href = "./login.html";
      }, 1000);
    }
  });
});
