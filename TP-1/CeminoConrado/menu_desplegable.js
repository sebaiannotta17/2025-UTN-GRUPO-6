const logo = document.getElementById("logo_header");
const menu = document.getElementById("menu_desplegable");

logo.addEventListener("click", () => {
  menu.style.display = menu.style.display === "block" ? "none" : "block";
});

// si se clickea fuera del menu se cierra
document.addEventListener("click", (event) => {
  if (!menu.contains(event.target) && event.target !== logo) {
    menu.style.display = "none";
  }
});
