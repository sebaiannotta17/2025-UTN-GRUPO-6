document.addEventListener("DOMContentLoaded", () => {
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
});
