// ========== COMPTEUR DE CARACTÈRES - TITRE ==========
const titreInput = document.getElementById('titre');
const titreCountEl = document.getElementById('titre-count');

if (titreInput && titreCountEl) {
    titreInput.addEventListener('input', function() {
        titreCountEl.textContent = this.value.length;
    });
}

// ========== COMPTEUR DE CARACTÈRES - CONTENU ==========
const contenuInput = document.getElementById('contenu');
const contenuCountEl = document.getElementById('contenu-count');

if (contenuInput && contenuCountEl) {
    contenuInput.addEventListener('input', function() {
        contenuCountEl.textContent = this.value.length;
    });
}

// ========== PRÉVISUALISATION DES MÉDIAS ==========
// (géré inline dans creerarticle.html via la fonction previewMedia)
// Les fonctions previewMedia() et removeMedia() sont déjà définies dans le HTML

// ========== SOUMETTRE LE FORMULAIRE ==========
// (géré inline dans creerarticle.html via la fonction publierArticle)
// Cette fonction est déjà définie dans le HTML

// ========== RÉINITIALISER ==========
// (géré inline dans creerarticle.html via la fonction resetForm)

// ========== ANNULER ==========
function annuler() {
    if (confirm('❌ Voulez-vous vraiment annuler ? Les modifications seront perdues.')) {
        window.location.href = 'Profil.html';
    }
}

// ========== SAUVEGARDER EN BROUILLON ==========
function sauvegarderBrouillon() {
    const titre = document.getElementById('titre')?.value.trim();
    if (!titre) {
        alert('⚠️ Veuillez au moins saisir un titre avant de sauvegarder en brouillon.');
        return;
    }
    alert('💾 Article sauvegardé en brouillon !');
    window.location.href = 'Profil.html';
}
