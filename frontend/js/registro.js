/* document.addEventListener("DOMContentLoaded", () => {
  console.log("[registro] JS cargado");

  const $error  = document.getElementById("form-error");
  const $toasts = document.getElementById("toast-container");
  const $form   = document.getElementById("form-reg");
  const $pw1    = document.getElementById("pw1");
  const $pw2    = document.getElementById("pw2");

  function showError(msg){ $error.textContent = msg; $error.style.display = "block"; }
  function clearError(){ $error.textContent = ""; $error.style.display = "none"; }
  function toast(m, isError=false){
    const d = document.createElement("div");
    d.className = "toast" + (isError ? " error" : "");
    d.textContent = m;
    $toasts.appendChild(d);
    setTimeout(() => d.remove(), 3000);
  }
  function markFieldError(el, on=true){ el.classList.toggle("field-error", !!on); }

  const LS_USERS_KEY = "users";
  const getUsers  = () => { try { return JSON.parse(localStorage.getItem(LS_USERS_KEY)) || []; } catch { return []; } };
  const saveUsers = (arr) => localStorage.setItem(LS_USERS_KEY, JSON.stringify(arr));

  [$pw1, $pw2].forEach(i => i.addEventListener("input", () => {
    if ($pw1.value && $pw2.value && $pw1.value === $pw2.value) {
      clearError(); markFieldError($pw1, false); markFieldError($pw2, false);
    }
  }));

  $form.addEventListener("submit", (e) => {
    e.preventDefault();
    clearError(); markFieldError($pw1, false); markFieldError($pw2, false);

    const f = new FormData($form);
    const name  = (f.get("name") || "").trim();
    const email = (f.get("email") || "").trim().toLowerCase();
    const pass1 = (f.get("password")  || "").trim();
    const pass2 = (f.get("password2") || "").trim();

    if (!name || !email || !pass1 || !pass2) { showError("⚠️ Completá todos los campos."); return; }
    if (pass1 !== pass2) {
      showError("⚠️ Las contraseñas no coinciden."); markFieldError($pw1, true); markFieldError($pw2, true); $pw2.focus(); return;
    }

    const users = getUsers();
    if (users.some(u => (u.name||"").toLowerCase()  === name.toLowerCase())) { showError("⚠️ Usuario ya registrado."); return; }
    if (users.some(u => (u.email||"").toLowerCase() === email)) { showError("⚠️ Ese email ya está en uso."); return; }

    const newUser = { id: Date.now(), name, email };
    users.push(newUser); saveUsers(users);

    localStorage.setItem("user", JSON.stringify(newUser));
    localStorage.setItem("token", "local." + btoa(email) + ".token");

    toast("✅ Cuenta creada. Iniciando sesión...");
setTimeout(() => (location.href = "./main.html"), 300);
  });
}); */



// La lógica JS que maneja el formulario de registro va aquí
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("form-reg");
    const errorDiv = document.getElementById("form-error");

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        
        // Limpiar errores previos
        errorDiv.style.display = 'none';
        errorDiv.textContent = '';
        document.querySelectorAll('.field-error').forEach(el => el.classList.remove('field-error'));

        const name = form.elements['name'].value;
        const email = form.elements['email'].value;
        const password = form.elements['password'].value;
        const password2 = form.elements['password2'].value;

        let hasError = false;

        if (password !== password2) {
            errorDiv.textContent = 'Las contraseñas no coinciden.';
            errorDiv.style.display = 'block';
            document.getElementById('pw1').classList.add('field-error');
            document.getElementById('pw2').classList.add('field-error');
            hasError = true;
        }

        if (password.length < 6) {
             errorDiv.textContent = 'La contraseña debe tener al menos 6 caracteres.';
             errorDiv.style.display = 'block';
             document.getElementById('pw1').classList.add('field-error');
             hasError = true;
        }

        // Aquí iría la lógica de registro (ej. llamada a una API de Firebase o backend)
        if (!hasError) {
            console.log('Usuario registrado con éxito:', { name, email, password });
            // Simulación de registro exitoso y redirección
            setTimeout(() => {
                // En un entorno real, aquí se llamaría a una API de registro
                // alert('Registro exitoso. Redirigiendo a Login...'); // Usamos console.log en lugar de alert
                console.log('Registro exitoso. Redirigiendo a Login...');
                location.href = './Login.html'; 
            }, 1000);
        }
    });
});
