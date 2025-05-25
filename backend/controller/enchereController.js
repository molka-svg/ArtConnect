const enchereModel = require('../model/enchereModel');
const miseModel = require('../model/miseModel');

exports.creerEnchere = (req, res) => {
  const { oeuvre_id, mise_de_depart, increment, date_debut, date_fin, signature_validation } = req.body;

  // Validation des données
  if (!oeuvre_id || !mise_de_depart || !increment || !date_debut || !date_fin) {
    return res.status(400).json({ message: 'Tous les champs sont requis' });
  }

  if (new Date(date_debut) >= new Date(date_fin)) {
    return res.status(400).json({ message: 'La date de fin doit être postérieure à la date de début' });
  }

  enchereModel.createEnchere(
    { oeuvre_id, mise_de_depart, increment, date_debut, date_fin, signature_validation },
    (err, result) => {
      if (err) return res.status(500).json({ message: 'Erreur lors de la création de l\'enchère', error: err });
      res.status(201).json({ message: 'Enchère créée', id: result.insertId });
    }
  );
};

exports.placerMise = (req, res) => {
  const { enchere_id, utilisateur_id, montant } = req.body;

  // Validation des données
  if (!enchere_id || !utilisateur_id || !montant) {
    return res.status(400).json({ message: 'Tous les champs sont requis' });
  }

  miseModel.placerMise({ enchere_id, utilisateur_id, montant }, (err, result) => {
    if (err) return res.status(400).json({ message: err.message });
    res.status(201).json({ message: 'Mise enregistrée' });
  });
};
// Obtenir les enchères d'un artiste
exports.getEncheresByArtiste = (req, res) => {
  const { artiste_id } = req.params;
  
  enchereModel.getEncheresByArtiste(artiste_id, (err, result) => {
    if (err) return res.status(500).json({ message: 'Erreur serveur', error: err });
    res.status(200).json(result);
  });
};

// Obtenir les enchères actives
exports.getEncheresActives = (req, res) => {
  enchereModel.getEncheresActives((err, result) => {
    if (err) return res.status(500).json({ message: 'Erreur serveur', error: err });
    res.status(200).json(result);
  });
};

// Obtenir les détails d'une enchère
exports.getEnchereDetails = (req, res) => {
  const { enchere_id } = req.params;
  
  enchereModel.getEnchereDetails(enchere_id, (err, result) => {
    if (err) return res.status(500).json({ message: 'Erreur serveur', error: err });
    if (result.length === 0) return res.status(404).json({ message: 'Enchère non trouvée' });
    res.status(200).json(result[0]);
  });
};

// Obtenir l'historique des mises pour une enchère
exports.getMisesByEnchere = (req, res) => {
  const { enchere_id } = req.params;
  
  miseModel.getMisesByEnchere(enchere_id, (err, result) => {
    if (err) return res.status(500).json({ message: 'Erreur serveur', error: err });
    res.status(200).json(result);
  });
};