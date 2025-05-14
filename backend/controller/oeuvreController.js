const db = require('../config/db');
const Oeuvre = require('../model/oeuvreModel');
exports.ajouterOeuvre = async (req, res) => {
  try {
    const { titre, description, prix, type, image } = req.body;
    const artiste_id = req.user.userid;
    const id = await Oeuvre.ajouter({ titre, description, prix, type, image, artiste_id });
    res.status(201).json({ 
      message: 'Votre œuvre est en cours de considération. Elle sera disponible sur notre site après approbation par l\'administrateur.', 
      id 
    });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de l’ajout', error: err.message });
  }
};

exports.getOeuvresByArtiste = async (req, res) => {
  try {
    const artiste_id = req.user.userid;
    const oeuvres = await Oeuvre.getByArtisteId(artiste_id);
    res.json(oeuvres);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération', error: err.message });
  }
};

exports.supprimerOeuvre = async (req, res) => {
  try {
    const id = req.params.id;
    await Oeuvre.supprimer(id);
    res.json({ message: 'Œuvre supprimée avec succès' });
  } catch (err) {
    console.error('Erreur lors de la suppression : ', err);
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.getOeuvreById = (req, res) => {
  const { id } = req.params;
  const query = `SELECT * FROM oeuvres WHERE oeuvre_id = ?`;
  
  db.query(query, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Erreur serveur', error: err });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: 'Œuvre non trouvée' });
    }
    res.status(200).json(result[0]);
  });
};

exports.modifierOeuvre = async (req, res) => {
  try {
    const id = req.params.id;
    const oeuvre = await Oeuvre.getById(id);
    if (!oeuvre || oeuvre.artiste_id !== req.user.userid) {
      return res.status(403).json({ message: 'Non autorisé' });
    }

    await Oeuvre.modifier(id, req.body);
    res.json({ message: 'Oeuvre modifiée avec succès' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la modification', error: err.message });
  }
};

exports.getOeuvresEnAttente = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }
    
    const [rows] = await db.promise().query(
      'SELECT o.*, CONCAT(u.prenom, " ", u.nom) AS artiste_nom FROM oeuvres o JOIN users u ON o.artiste_id = u.userid WHERE o.statut = "en_attente"'
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.approuverOeuvre = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }
    const { id } = req.params;
    await db.promise().query(
      'UPDATE oeuvres SET statut = "approuve" WHERE oeuvre_id = ?',
      [id]
    );
    res.json({ message: 'Œuvre approuvée avec succès' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};
exports.rejeterOeuvre = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }
    const { id } = req.params;
    await db.promise().query(
      'UPDATE oeuvres SET statut = "rejete" WHERE oeuvre_id = ?',
      [id]
    );
    res.json({ message: 'Œuvre rejetée avec succès' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.getAllOeuvres = async (req, res) => {
  try {
    const query = `
      SELECT o.*, CONCAT(u.prenom, ' ', u.nom) AS artiste_nom
      FROM oeuvres o
      LEFT JOIN users u ON o.artiste_id = u.userid
      WHERE o.statut = 'approuve'
    `;
    const [rows] = await db.promise().query(query);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération des œuvres', error: err.message });
  }
};