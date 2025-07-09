document.addEventListener('DOMContentLoaded', function() {
    const frases = document.querySelectorAll('#frase1, #frase2, #frase3');

    frases.forEach(frase => {
        frase.style.display = 'none';
    });
    
    const randomIndex = Math.floor(Math.random() * frases.length);
    frases[randomIndex].style.display = 'block';
    
    frases[randomIndex].style.opacity = '0';
    frases[randomIndex].style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        frases[randomIndex].style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        frases[randomIndex].style.opacity = '1';
        frases[randomIndex].style.transform = 'translateY(0)';
    }, 100);
});
