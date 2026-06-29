// ============================================================
//  supabase.js  —  Backend VoxPop via Supabase
//
//  INSTRUCTIONS DE CONFIGURATION :
//  1. Crée un projet gratuit sur https://supabase.com
//  2. Dans ton projet Supabase → Settings → API
//     → copie "Project URL" et "anon public key"
//  3. Remplace les deux valeurs ci-dessous
//  4. Dans Supabase → SQL Editor, exécute le script SQL
//     fourni dans README.md pour créer les tables
// ============================================================

const SUPABASE_URL = 'REMPLACE_PAR_TON_URL_SUPABASE';
const SUPABASE_ANON_KEY = 'REMPLACE_PAR_TA_CLE_ANON';

// Import du client Supabase (chargé via CDN dans les HTML)
const { createClient } = supabase;
const sb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ============================================================
//  INSCRIPTION
// ============================================================
async function inscrireUtilisateur(nom, prenom, nomChaine, email, motDePasse) {
    // 1. Créer le compte auth Supabase (gère le hash du mot de passe)
    const { data: authData, error: authError } = await sb.auth.signUp({
        email,
        password: motDePasse,
        options: {
            data: { nom, prenom, nom_chaine: nomChaine }
        }
    });

    if (authError) {
        if (authError.message.includes('already registered')) {
            throw new Error('Cet email est déjà utilisé.');
        }
        throw new Error('Erreur inscription : ' + authError.message);
    }

    // 2. Enregistrer le profil dans la table "utilisateurs"
    const { error: dbError } = await sb
        .from('utilisateurs')
        .insert([{
            id:         authData.user.id,
            nom,
            prenom,
            nom_chaine: nomChaine,
            email
        }]);

    if (dbError) throw new Error('Erreur profil : ' + dbError.message);

    return authData.user;
}

// ============================================================
//  CONNEXION
// ============================================================
async function connecterUtilisateur(email, motDePasse) {
    const { data, error } = await sb.auth.signInWithPassword({ email, password: motDePasse });

    if (error) {
        if (error.message.includes('Invalid login')) {
            throw new Error('Email ou mot de passe incorrect.');
        }
        throw new Error('Erreur connexion : ' + error.message);
    }

    // Stocker les infos de session pour les autres pages
    sessionStorage.setItem('voxpop_user_id',    data.user.id);
    sessionStorage.setItem('voxpop_user_email', data.user.email);

    // Récupérer le profil complet depuis la table utilisateurs
    const { data: profil } = await sb
        .from('utilisateurs')
        .select('*')
        .eq('id', data.user.id)
        .single();

    if (profil) {
        sessionStorage.setItem('voxpop_nom',       profil.nom);
        sessionStorage.setItem('voxpop_prenom',    profil.prenom);
        sessionStorage.setItem('voxpop_nom_chaine',profil.nom_chaine);
    }

    return data.user;
}

// ============================================================
//  DÉCONNEXION
// ============================================================
async function deconnecterUtilisateur() {
    await sb.auth.signOut();
    sessionStorage.clear();
    window.location.href = 'index.html';
}

// ============================================================
//  VÉRIFIER SI L'UTILISATEUR EST CONNECTÉ
//  (à appeler en haut des pages protégées)
// ============================================================
async function verifierSession() {
    const { data: { session } } = await sb.auth.getSession();
    if (!session) {
        window.location.href = 'seconnecter.html';
        return null;
    }
    return session.user;
}

// ============================================================
//  MOT DE PASSE OUBLIÉ — envoyer l'email de reset
// ============================================================
async function envoyerEmailReset(email) {
    const { error } = await sb.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/oubliemdp3.html'
    });
    if (error) throw new Error('Erreur : ' + error.message);
}

// ============================================================
//  MOT DE PASSE OUBLIÉ — définir le nouveau mot de passe
// ============================================================
async function reinitialiserMotDePasse(nouveauMotDePasse) {
    const { error } = await sb.auth.updateUser({ password: nouveauMotDePasse });
    if (error) throw new Error('Erreur : ' + error.message);
}

// ============================================================
//  RÉCUPÉRER LE PROFIL UTILISATEUR CONNECTÉ
// ============================================================
async function getMonProfil() {
    const { data: { user } } = await sb.auth.getUser();
    if (!user) return null;

    const { data, error } = await sb
        .from('utilisateurs')
        .select('*')
        .eq('id', user.id)
        .single();

    if (error) throw new Error('Erreur profil : ' + error.message);
    return data;
}

// ============================================================
//  METTRE À JOUR LE PROFIL
// ============================================================
async function mettreAJourProfil(nom, nomChaine, bio) {
    const { data: { user } } = await sb.auth.getUser();
    if (!user) throw new Error('Non connecté');

    const { error } = await sb
        .from('utilisateurs')
        .update({ nom, nom_chaine: nomChaine, bio })
        .eq('id', user.id);

    if (error) throw new Error('Erreur mise à jour : ' + error.message);
}

// ============================================================
//  PUBLIER UN POST
// ============================================================
async function publierPost(contenu, mediaUrl = null) {
    const { data: { user } } = await sb.auth.getUser();
    if (!user) throw new Error('Non connecté');

    const { data, error } = await sb
        .from('posts')
        .insert([{
            auteur_id: user.id,
            contenu,
            media_url: mediaUrl
        }])
        .select()
        .single();

    if (error) throw new Error('Erreur publication : ' + error.message);
    return data;
}

// ============================================================
//  RÉCUPÉRER LE FIL D'ACTUALITÉ
// ============================================================
async function getFilActualite() {
    const { data, error } = await sb
        .from('posts')
        .select(`
            *,
            utilisateurs ( nom, nom_chaine )
        `)
        .order('created_at', { ascending: false })
        .limit(50);

    if (error) throw new Error('Erreur fil : ' + error.message);
    return data;
}

// ============================================================
//  PUBLIER UN ARTICLE
// ============================================================
async function publierArticle(titre, description, contenu, mediaUrl = null) {
    const { data: { user } } = await sb.auth.getUser();
    if (!user) throw new Error('Non connecté');

    const { data, error } = await sb
        .from('articles')
        .insert([{
            auteur_id: user.id,
            titre,
            description,
            contenu,
            media_url: mediaUrl
        }])
        .select()
        .single();

    if (error) throw new Error('Erreur publication article : ' + error.message);
    return data;
}

// ============================================================
//  UPLOADER UN FICHIER (photo de profil, bannière, média)
// ============================================================
async function uploaderFichier(fichier, dossier = 'medias') {
    const { data: { user } } = await sb.auth.getUser();
    if (!user) throw new Error('Non connecté');

    const extension = fichier.name.split('.').pop();
    const nomFichier = `${dossier}/${user.id}_${Date.now()}.${extension}`;

    const { error } = await sb.storage
        .from('voxpop')
        .upload(nomFichier, fichier, { upsert: true });

    if (error) throw new Error('Erreur upload : ' + error.message);

    const { data: urlData } = sb.storage
        .from('voxpop')
        .getPublicUrl(nomFichier);

    return urlData.publicUrl;
}

// Exposer globalement
window.VoxPop = {
    inscrireUtilisateur,
    connecterUtilisateur,
    deconnecterUtilisateur,
    verifierSession,
    envoyerEmailReset,
    reinitialiserMotDePasse,
    getMonProfil,
    mettreAJourProfil,
    publierPost,
    getFilActualite,
    publierArticle,
    uploaderFichier,
    supabase: sb
};
