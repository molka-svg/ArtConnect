const db = require('../config/db'); // Assure-toi que cette ligne est présente
const Oeuvre = require('../model/oeuvreModel');

exports.ajouterOeuvre = async (req, res) => {
  try {
    const { titre, description, prix, type, image } = req.body;
    const artiste_id = req.user.userid;
    const id = await Oeuvre.ajouter({ titre, description, prix, type, image, artiste_id });
    res.status(201).json({ message: 'Oeuvre ajoutée', id });
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

exports.getAllOeuvres = async (req, res) => {
  try {
    const query = `
  SELECT o.*, CONCAT(u.prenom, ' ', u.nom) AS artiste_nom
  FROM oeuvres o
  LEFT JOIN users u ON o.artiste_id = u.userid
  WHERE u.role = 'artiste' or u.role=NULL
`;
    const [rows] = await db.promise().query(query);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération des œuvres', error: err.message });
  }
};