// ========== COMPTEUR DE CARACTÈRES - TITRE ==========
const titreInput = document.getElementById('titre');
const titreCountEl = document.getElementById('titre-count');

if (titreInput && titreCountEl) {
    titreInput.addEventListener('input', function() {
        titreCountEl.textContent = this.value.length;
    });
}

// ========== COMPTEUR DE CARACTÈRES - DESCRIPTION ==========
// Note : creervideo.html n'a pas de champ #contenu, uniquement #titre et #description
const descriptionInput = document.getElementById('description');

// ========== PRÉVISUALISATION VIDÉO/IMAGE ==========
const imageUpload = document.getElementById('image-upload');
const preview = document.getElementById('preview');

if (imageUpload && preview) {
    imageUpload.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                preview.src = event.target.result;
                preview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });
}

// ========== SOUMETTRE LE FORMULAIRE ==========
const postForm = document.getElementById('postForm');
if (postForm) {
    postForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const titre = titreInput ? titreInput.value.trim() : '';
        const description = descriptionInput ? descriptionInput.value.trim() : '';
        const commentaires = document.getElementById('commentaires')?.checked ?? true;

        if (!titre) {
            alert('⚠️ Veuillez saisir un titre pour votre vidéo');
            if (titreInput) titreInput.focus();
            return;
        }

        if (!description) {
            alert('⚠️ Veuillez saisir une description pour votre vidéo');
            if (descriptionInput) descriptionInput.focus();
            return;
        }

        alert('✅ Vidéo publiée avec succès !\n\nTitre : ' + titre + '\nCommentaires : ' + (commentaires ? 'Autorisés' : 'Désactivés'));
        window.location.href = 'Profil.html';
    });
}

// ========== ANNULER ==========
function annuler() {
    if (confirm('❌ Voulez-vous vraiment annuler ? Les modifications seront perdues.')) {
        window.location.href = 'Profil.html';
    }
}
