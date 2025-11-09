document.addEventListener('DOMContentLoaded', () => {
  // =======================================================
  // Variables de jeu
  // =======================================================
  let nombreSecret = Math.floor(Math.random() * 20) + 1;
  let compteurTentatives = 0;

  // =======================================================
  // Références aux éléments HTML
  // =======================================================
  const inputTentative = document.getElementById('tentative');
  const resultatElement = document.getElementById('resultat');
  const boutonDeviner = document.getElementById('boutonDeviner');
  const boutonRejouer = document.getElementById('boutonRejouer');

  // Sécurité : vérifier que les éléments existent
  if (!inputTentative || !resultatElement || !boutonDeviner || !boutonRejouer) {
    console.error('Un ou plusieurs éléments HTML sont introuvables. Vérifie les ids dans ton HTML.');
    return; // on stoppe proprement
  }

  // Met quelques attributs utiles pour mobile (optionnel si déjà dans HTML)
  inputTentative.setAttribute('inputmode', 'numeric');
  inputTentative.setAttribute('pattern', '\\d*');
  inputTentative.setAttribute('autocomplete', 'off');
  inputTentative.setAttribute('placeholder', '1 - 20');

  // =======================================================
  // Fonctions utilitaires
  // =======================================================
  function parseIntegerFromMobile(raw) {
    if (!raw) return NaN;

    // 1) trim et enlever espaces normaux + spéciaux (insécables)
    let s = String(raw).trim().replace(/\u00A0|\u202F/g, '');

    // 2) remplacer virgule par point (pour éviter NaN si utilisateur met "12,0")
    s = s.replace(',', '.');

    // 3) trouver le premier entier dans la chaîne (utile si le clavier ajoute autre chose)
    const m = s.match(/-?\d+/);
    if (!m) return NaN;
    return parseInt(m[0], 10);
  }

  function afficherMessage(txt, couleur = 'transparent') {
    resultatElement.textContent = txt;
    resultatElement.style.backgroundColor = couleur;
    // pour accessibilité : annonce la mise à jour
    resultatElement.setAttribute('role', 'status');
  }

  // =======================================================
  // Fonctions du jeu
  // =======================================================
  function verifierTentative() {
    const raw = inputTentative.value;
    const tentativeJoueur = parseIntegerFromMobile(raw);

    if (raw === '' || Number.isNaN(tentativeJoueur) || tentativeJoueur < 1 || tentativeJoueur > 20) {
      afficherMessage("Erreur : entre un nombre valide entre 1 et 20 !", 'orange');
      // garde le clavier ouvert sur mobile : ne blur pas l'input
      inputTentative.value = '';
      inputTentative.focus();
      return;
    }

    compteurTentatives++;

    if (tentativeJoueur === nombreSecret) {
      afficherMessage(`🥳 Bravo, bâtisseur du digital ! Tu as trouvé le nombre secret (${nombreSecret}) en ${compteurTentatives} essais.`, 'lightgreen');
      terminerPartie();
    } else if (tentativeJoueur < nombreSecret) {
      afficherMessage(`C'est ${tentativeJoueur}. Trop bas. Essaie encore !`, 'lightblue');
    } else {
      afficherMessage(`C'est ${tentativeJoueur}. Trop haut. Essaie encore !`, 'lightcoral');
    }

    // Effacer et remettre le focus pour la prochaine tentative
    inputTentative.value = '';
    inputTentative.focus();
  }

  function terminerPartie() {
    boutonDeviner.disabled = true;
    inputTentative.disabled = true;
    boutonRejouer.style.display = 'inline-block';
    resultatElement.setAttribute('aria-live', 'polite');
  }

  function reinitialiserJeu() {
    nombreSecret = Math.floor(Math.random() * 20) + 1;
    compteurTentatives = 0;

    afficherMessage("Je pense à un nouveau nombre entre 1 et 20. À toi de jouer !", 'transparent');

    inputTentative.value = '';
    inputTentative.disabled = false;
    boutonDeviner.disabled = false;
    boutonRejouer.style.display = 'none';
    inputTentative.focus();
  }

  // =======================================================
  // Événements : ajoute click + touchstart (mobile)
  // =======================================================
  const safeClick = (fn) => (e) => { e.preventDefault(); fn(); };

  boutonDeviner.addEventListener('click', verifierTentative);
  boutonDeviner.addEventListener('touchstart', safeClick(verifierTentative), { passive: false });

  boutonRejouer.addEventListener('click', reinitialiserJeu);
  boutonRejouer.addEventListener('touchstart', safeClick(reinitialiserJeu), { passive: false });

  // Permettre d'appuyer sur Entrée dans l'input (clavier mobile aussi)
  inputTentative.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.keyCode === 13) {
      verifierTentative();
    }
  });

  // Mise en page initiale
  boutonRejouer.style.display = 'none';
  afficherMessage("Je pense à un nombre entre 1 et 20. Devine-le !", 'transparent');

  // Pour debug rapide : affiche le secret dans la console (supprime plus tard)
  console.log('Nombre secret (debug) =', nombreSecret);
});
