const db = require('../config/db');
const Evenement = require('../model/evenementModel');

exports.ajouterEvenement = async (req, res) => {
  try {
    const { titre, description, date, heure, type, duree, lieu, prix_ticket, nombre_places } = req.body;
    const organisateur_id = req.user.userid;
    const places_disponibles = nombre_places;
    const id = await Evenement.ajouter({
      titre,
      description,
      date,
      heure,
      type,
      duree,
      lieu,
      prix_ticket,
      nombre_places,
      places_disponibles,
      organisateur_id
    });
    res.status(201).json({ message: 'Événement ajouté avec succès', id });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de l’ajout', error: err.message });
  }
};

exports.getEvenementsByOrganisateur = async (req, res) => {
  try {
    const organisateur_id = req.user.userid;
    const evenements = await Evenement.getByOrganisateur(organisateur_id);
    res.json(evenements);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération', error: err.message });
  }
};

exports.getAllEvenements = async (req, res) => {
  try {
    const query = `
      SELECT e.*, CONCAT(u.prenom, ' ', u.nom) AS organisateur_nom
      FROM evenement e
      LEFT JOIN users u ON e.organisateur_id = u.userid
      WHERE u.role = 'admin' OR u.role IS NULL
    `;
    const [rows] = await db.promise().query(query);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération des événements', error: err.message });
  }
};

exports.getEvenementById = (req, res) => {
  const { id } = req.params;
  const query = `SELECT * FROM evenement WHERE id = ?`;
  db.query(query, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Erreur serveur', error: err });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: 'Événement non trouvé' });
    }
    res.status(200).json(result[0]);
  });
};

exports.modifierEvenement = async (req, res) => {
  try {
    const id = req.params.id;
    const evenement = await Evenement.getById(id);
    if (!evenement || evenement.organisateur_id !== req.user.userid) {
      return res.status(403).json({ message: 'Non autorisé' });
    }
    await Evenement.modifier(id, req.body);
    res.json({ message: 'Événement modifié avec succès' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la modification', error: err.message });
  }
};

exports.supprimerEvenement = async (req, res) => {
  try {
    const id = req.params.id;
    await Evenement.supprimer(id);
    res.json({ message: 'Événement supprimé avec succès' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};
