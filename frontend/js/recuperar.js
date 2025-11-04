const form = document.getElementById("form-rec");
const toasts = document.getElementById("toast-container");

// Función simple de notificación
function toast(m, e = false) {
  const d = document.createElement("div");
  d.className = "toast" + (e ? " error" : "");
  d.textContent = m;

  if (toasts) {
    toasts.appendChild(d);
    setTimeout(() => d.remove(), 3000);
  } else {
    console.warn("Toast container not found. Message:", m);
  }
}

// Listener del envío del formulario
form.addEventListener("submit", (e) => {
  e.preventDefault();

  // Obtener y limpiar el email
  const emailInput = form.querySelector('input[name="email"]');
  const email = (emailInput.value || "").trim();

  // Validación básica
  if (!email || !email.includes("@") || email.length < 5) {
    toast("Ingresá un email válido", true);
    emailInput.classList.add("field-error");
    setTimeout(() => emailInput.classList.remove("field-error"), 1500);
    return;
  }

  // Simulación de envío exitoso
  toast("Email de recuperación enviado (modo mock). Revisa tu bandeja.");
});

const style = document.createElement("style");
style.textContent = `
    #toast-container {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 1000;
        display: flex;
        flex-direction: column;
        gap: 10px;
        pointer-events: none; /* Permite clicks a través del toast */
    }
    .toast {
        background-color: #4CAF50; /* Verde */
        color: white;
        padding: 10px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
        opacity: 0.95;
        font-weight: 600;
        transition: opacity 0.3s ease-in-out;
    }
    .toast.error {
        background-color: #e53935; /* Rojo */
    }
    .field-error {
        border-color: #e53935 !important;
        outline: 0 !important;
    }
`;
document.head.appendChild(style);
