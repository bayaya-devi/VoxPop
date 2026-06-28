// ========== NAVIGATION ENTRE PAGES ==========
function showPage(id) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const page = document.getElementById(id);
    if (page) page.classList.add('active');

    // Mettre à jour le bouton actif dans la sidebar
    document.querySelectorAll('.sidebar-btn').forEach(btn => btn.classList.remove('active'));
    const btnActif = document.querySelector(`.sidebar-btn[onclick="showPage('${id}')"]`);
    if (btnActif) btnActif.classList.add('active');
}

// ========== BULLES CLIQUABLES ==========
// Correction : la variable s'appelait "bulles" mais le forEach utilisait "bulle"
const bulles = document.querySelectorAll('.bulle');

bulles.forEach(bulle => {
    bulle.addEventListener('click', function() {
        bulles.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
    });
});
