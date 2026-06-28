async function traiterDemandeIA(message) {
    const API_KEY = "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" ; // Gratuit sur huggingface.co
    
    const prompt = `Tu es un assistant pour le réseau social Infox. L'utilisateur peut :
- Voir son profil (icône 👤)
- Publier des posts (zone "Quoi de neuf")
- Rechercher (icône 🔍)
- Se déconnecter (icône en bas)

Question de l'utilisateur : ${message}

Réponds de manière concise et utile :`;

    try {
        const response = await fetch(
            "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2",
            {
                headers: { 
                    Authorization: `Bearer ${API_KEY}`,
                    "Content-Type": "application/json"
                },
                method: "POST",
                body: JSON.stringify({
                    inputs: prompt,
                    parameters: {
                        max_new_tokens: 200,
                        temperature: 0.7
                    }
                }),
            }
        );
        
        const result = await response.json();
        const reponse = result[0].generated_text.split("Réponds de manière concise et utile :")[1]?.trim() || "Désolé, je n'ai pas compris.";
        
        ajouterMessage(reponse, 'assistant-msg');
    } catch (error) {
        ajouterMessage("⚠️ Erreur de connexion à l'IA. Réessaie.", 'assistant-msg');
    }
}

// Dans envoyerMessage(), remplace traiterDemande(message) par :
traiterDemandeIA(message);