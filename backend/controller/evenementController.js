const db = require('../config/db');
const Evenement = require('../model/evenementModel');

exports.ajouterEvenement = async (req, res) => {
  try {
    const { titre, description, date_evt, heure, type, duree, lieu, prix_ticket, nombre_places } = req.body;
    const organisateur_id = req.user.userid;
    
    const id = await Evenement.ajouter({ 
      titre,
      description,
      date_evt,
      heure,
      type,
      duree,
      lieu,
      prix_ticket,
      nombre_places,
      places_disponibles: nombre_places,
      organisateur_id,
      statut: 'en_attente'
    });
    
    res.status(201).json({ 
      message: 'Votre événement est en cours de considération...', 
      id 
    });
  } catch (err) {
    res.status(500).json({ 
      message: 'Erreur lors de la création',
      error: err.message 
    });
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

exports.getEvenementsEnAttente = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }
    
    const [rows] = await db.promise().query(
      'SELECT e.*, CONCAT(u.prenom, " ", u.titre) AS organisateur_nom FROM evenement e JOIN users u ON e.organisateur_id = u.userid WHERE e.statut = "en_attente"'
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.approuverEvenement = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }
    
    const { id } = req.params;
    await db.promise().query('UPDATE evenement SET statut = "approuve" WHERE id = ?', [id]);
    res.json({ message: 'Événement approuvé avec succès' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.rejeterEvenement = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }
    
    const { id } = req.params;
    await db.promise().query('UPDATE evenement SET statut = "rejete" WHERE id = ?', [id]);
    res.json({ message: 'Événement rejeté avec succès' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.getAllEvenements = async (req, res) => {
  try {
    const [rows] = await db.promise().query(`
      SELECT e.*, CONCAT(u.prenom, ' ', u.titre) AS organisateur_nom
      FROM evenement e
      LEFT JOIN users u ON e.organisateur_id = u.userid
      WHERE e.statut = 'approuve'
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération des événements', error: err.message });
  }
};

exports.getEvenementById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.promise().query('SELECT * FROM evenement WHERE id = ?', [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Événement non trouvé' });
    }
    
    res.status(200).json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
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