document.addEventListener("DOMContentLoaded", () => {
  // Continuidad busqueda
  const form = document.getElementById("search-form");
  const input = document.getElementById("search-input");

  if (form && input) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const query = input.value.trim();
      if (!query) return;

      // Redirige a busqueda.html con la palabra escrita
      window.location.href = `./busqueda.html?q=${encodeURIComponent(query)}`;
    });
  }

  // Boton login o perfil segun corresponda
  const $navLoginBtn = document.getElementById("nav-login-btn");
  const $navPerfilBtn = document.getElementById("nav-perfil-btn");

  const usuario = JSON.parse(localStorage.getItem("user"));
  // Comprobar si existe un usuario logueado
  if (usuario && usuario.id) {
    // Estado Logueado
    if ($navLoginBtn) $navLoginBtn.style.display = "none";
    if ($navPerfilBtn) $navPerfilBtn.style.display = "inline-block";
  } else {
    // Estado NO Logueado
    if ($navLoginBtn) $navLoginBtn.style.display = "inline-block";
    if ($navPerfilBtn) $navPerfilBtn.style.display = "none";
  }
});
