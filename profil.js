// ========== BARRE DE RECHERCHE ==========
function toggleSearchBar() {
    const searchBar = document.getElementById('search-bar');
    if (!searchBar) return;
    searchBar.classList.toggle('hidden');
    if (!searchBar.classList.contains('hidden')) {
        searchBar.querySelector('input').focus();
    }
}

// ========== BANNIÈRE ==========
// Uniquement sur Profil.html
const banniereEl = document.getElementById('banniere-utilisateur');
if (banniereEl) {
    let banniereClicks = 0;
    let banniereTimeout;

    banniereEl.addEventListener('click', function(e) {
        e.stopPropagation();
        banniereClicks++;

        if (banniereClicks === 1) {
            banniereTimeout = setTimeout(() => {
                agrandirBanniere();
                banniereClicks = 0;
            }, 300);
        } else if (banniereClicks === 2) {
            clearTimeout(banniereTimeout);
            const changerBanniere = document.getElementById('changer-banniere');
            if (changerBanniere) changerBanniere.click();
            banniereClicks = 0;
        }
    });

    function agrandirBanniere() {
        const banniere = document.getElementById('banniere-utilisateur');
        const bgImage = window.getComputedStyle(banniere).backgroundImage;

        const modal = document.createElement('div');
        modal.className = 'modal-zoom';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <div class="image-agrandie" style="background-image: ${bgImage}; background-size: contain; background-repeat: no-repeat; background-position: center; width: 80vw; height: 80vh;"></div>
            </div>
        `;
        document.body.appendChild(modal);
        modal.querySelector('.close-modal').onclick = () => modal.remove();
        modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
    }

    const changerBanniereInput = document.getElementById('changer-banniere');
    if (changerBanniereInput) {
        changerBanniereInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    document.getElementById('banniere-utilisateur').style.backgroundImage = `url('${event.target.result}')`;
                };
                reader.readAsDataURL(file);
            }
        });
    }
}

// ========== MODIFIER LE NOM DE PROFIL ==========
const nomProfil = document.querySelector('.nom-profil');
if (nomProfil) {
    nomProfil.addEventListener('click', function() {
        const nomActuel = this.textContent;
        const input = document.createElement('input');
        input.type = 'text';
        input.value = nomActuel;
        input.className = 'edit-nom-profil';

        this.style.display = 'none';
        this.parentNode.insertBefore(input, this);
        input.focus();
        input.select();

        function sauvegarderNom() {
            const nouveauNom = this.value.trim();
            if (nouveauNom !== '') nomProfil.textContent = nouveauNom;
            nomProfil.style.display = 'block';
            this.remove();
        }

        input.addEventListener('blur', sauvegarderNom);
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') sauvegarderNom.call(this);
        });
    });
}

// ========== MODIFIER LA BIO ==========
const maBio = document.querySelector('.mabio');
if (maBio) {
    maBio.addEventListener('click', function() {
        const bioActuel = this.textContent;
        const input = document.createElement('input');
        input.type = 'text';
        input.value = bioActuel;
        input.className = 'edit-mabio';

        this.style.display = 'none';
        this.parentNode.insertBefore(input, this);
        input.focus();
        input.select();

        function sauvegarderbio() {
            const nouveaubio = this.value.trim();
            if (nouveaubio !== '') maBio.textContent = nouveaubio;
            maBio.style.display = 'block';
            this.remove();
        }

        input.addEventListener('blur', sauvegarderbio);
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') sauvegarderbio.call(this);
        });
    });
}

// ========== RUBRIQUES DU PROFIL ==========
function afficherContenu(section) {
    document.querySelectorAll('.btn-rubrique').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    document.querySelectorAll('.zone-contenu').forEach(sec => sec.classList.remove('active'));
    const target = document.getElementById(section);
    if (target) target.classList.add('active');
}

// ========== TOGGLE PARAMÈTRES ==========
function toggleParam(element) {
    element.classList.toggle('active');
}

// ========== SAUVEGARDER PARAMÈTRES ==========
function sauvegarderParametres() {
    const nomInput = document.getElementById('param-nom');
    const bioInput = document.getElementById('param-bio');
    if (!nomInput || !bioInput) return;

    const nom = nomInput.value;
    const bio = bioInput.value;

    const nomDisplay = document.querySelector('.nom-profil');
    const bioDisplay = document.querySelector('.mabio');
    if (nomDisplay) nomDisplay.textContent = nom;
    if (bioDisplay) bioDisplay.textContent = bio;

    alert('✅ Paramètres sauvegardés avec succès !');
    afficherContenu('posts');
    const btns = document.querySelectorAll('.btn-rubrique');
    if (btns[0]) btns[0].classList.add('active');
    if (btns[3]) btns[3].classList.remove('active');
}

// ========== MODAL POST ==========
const modalPost = document.getElementById('modalPost');
const contenuPost = document.getElementById('contenu-post');
const charCountPost = document.getElementById('charCountPost');
const btnPublishPost = document.getElementById('btnPublishPost');
const dropZone = document.getElementById('dropZone');
const mediaPreview = document.getElementById('mediaPreview');
const previewImage = document.getElementById('previewImage');
const previewVideo = document.getElementById('previewVideo');
const sondageContainer = document.getElementById('sondageContainer');
let sondageActif = false;

// N'initialiser le modal que si ses éléments existent (page Profil uniquement)
if (modalPost && contenuPost) {

    function ouvrirModalPost() {
        modalPost.classList.add('active');
        document.body.style.overflow = 'hidden';
        contenuPost.focus();
    }

    function fermerModalPost() {
        modalPost.classList.remove('active');
        document.body.style.overflow = 'auto';
        reinitialiserPost();
    }

    function fermerModalSiClicExterieur(e) {
        if (e.target === modalPost) fermerModalPost();
    }

    function reinitialiserPost() {
        const postForm = document.getElementById('postForm');
        if (postForm) postForm.reset();
        if (charCountPost) { charCountPost.textContent = '0/5000'; charCountPost.classList.remove('warning', 'error'); }
        if (btnPublishPost) btnPublishPost.disabled = true;
        supprimerMedia();
        supprimerSondage();
        if (dropZone) dropZone.classList.remove('active');
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalPost.classList.contains('active')) fermerModalPost();
    });

    // Compteur de caractères
    contenuPost.addEventListener('input', function() {
        const length = this.value.length;
        if (charCountPost) {
            charCountPost.textContent = `${length}/5000`;
            charCountPost.classList.remove('warning', 'error');
            if (length > 4500) charCountPost.classList.add('warning');
            if (length > 4900) charCountPost.classList.add('error');
        }
        if (btnPublishPost) btnPublishPost.disabled = length === 0;
    });

    // Média
    function ouvrirSelecteurMedia() {
        const mediaUpload = document.getElementById('mediaUpload');
        if (mediaUpload) mediaUpload.click();
    }

    const mediaUploadInput = document.getElementById('mediaUpload');
    if (mediaUploadInput) {
        mediaUploadInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (!file) return;
            if (file.type.startsWith('image/')) {
                if (file.size > 10 * 1024 * 1024) { alert('⚠️ Image trop volumineuse (max 10 Mo)'); return; }
                afficherMedia(file, 'image');
            } else if (file.type.startsWith('video/')) {
                if (file.size > 50 * 1024 * 1024) { alert('⚠️ Vidéo trop volumineuse (max 50 Mo)'); return; }
                afficherMedia(file, 'video');
            } else {
                alert('⚠️ Format non supporté');
            }
        });
    }

    function afficherMedia(file, type) {
        const reader = new FileReader();
        reader.onload = function(e) {
            if (type === 'image') {
                if (previewImage) { previewImage.src = e.target.result; previewImage.style.display = 'block'; }
                if (previewVideo) previewVideo.style.display = 'none';
            } else {
                if (previewVideo) { previewVideo.src = e.target.result; previewVideo.style.display = 'block'; }
                if (previewImage) previewImage.style.display = 'none';
            }
            if (mediaPreview) mediaPreview.classList.add('active');
            if (dropZone) dropZone.classList.remove('active');
        };
        reader.readAsDataURL(file);
    }

    function supprimerMedia() {
        if (mediaPreview) mediaPreview.classList.remove('active');
        if (previewImage) { previewImage.style.display = 'none'; previewImage.src = ''; }
        if (previewVideo) { previewVideo.style.display = 'none'; previewVideo.src = ''; }
        const mediaUpload = document.getElementById('mediaUpload');
        if (mediaUpload) mediaUpload.value = '';
    }

    // Drag & drop
    if (dropZone) {
        contenuPost.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.classList.add('active', 'dragover'); });
        contenuPost.addEventListener('dragleave', () => { dropZone.classList.remove('dragover'); });
        dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.classList.add('dragover'); });
        dropZone.addEventListener('dragleave', () => { dropZone.classList.remove('dragover'); });
        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('dragover');
            const file = e.dataTransfer.files[0];
            if (!file) return;
            if (file.type.startsWith('image/')) afficherMedia(file, 'image');
            else if (file.type.startsWith('video/')) afficherMedia(file, 'video');
            else alert('⚠️ Format non supporté');
        });
    }

    // Sondage
    function toggleSondage() {
        sondageActif = !sondageActif;
        if (sondageActif) {
            if (sondageContainer) sondageContainer.classList.add('active');
            supprimerMedia();
        } else {
            supprimerSondage();
        }
    }

    function supprimerSondage() {
        sondageActif = false;
        if (sondageContainer) sondageContainer.classList.remove('active');
        const q = document.getElementById('sondageQuestion');
        if (q) q.value = '';
        document.querySelectorAll('.sondage-option').forEach(opt => opt.value = '');
    }

    // Publier
    const postForm = document.getElementById('postForm');
    if (postForm) {
        postForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const texte = contenuPost.value.trim();
            let message = '✅ Post publié avec succès !';

            if (sondageActif) {
                const question = document.getElementById('sondageQuestion')?.value.trim();
                const options = Array.from(document.querySelectorAll('.sondage-option'))
                    .map(opt => opt.value.trim()).filter(val => val !== '');
                if (!question) { alert('⚠️ Veuillez saisir une question pour le sondage'); return; }
                if (options.length < 2) { alert('⚠️ Le sondage doit avoir au moins 2 options'); return; }
                message += '\n\n📊 Sondage: ' + question + '\n' + options.length + ' options';
            }

            if (texte || sondageActif) {
                alert(message);
                fermerModalPost();
            }
        });
    }

    // Exposer les fonctions globalement pour les onclick HTML
    window.ouvrirModalPost = ouvrirModalPost;
    window.fermerModalPost = fermerModalPost;
    window.fermerModalSiClicExterieur = fermerModalSiClicExterieur;
    window.ouvrirSelecteurMedia = ouvrirSelecteurMedia;
    window.supprimerMedia = supprimerMedia;
    window.toggleSondage = toggleSondage;
    window.supprimerSondage = supprimerSondage;
}

// Exposer les fonctions globales
window.toggleSearchBar = toggleSearchBar;
window.afficherContenu = afficherContenu;
window.toggleParam = toggleParam;
window.sauvegarderParametres = sauvegarderParametres;
