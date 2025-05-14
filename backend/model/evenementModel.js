const db = require('../config/db');
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
      organisateur_id
    });
    
    res.status(201).json({ 
      message: 'Votre événement est en cours de considération. Il sera disponible sur notre site après approbation par l\'administrateur.', 
      id 
    });
  } catch (err) {
    res.status(500).json({ 
      message: 'Erreur lors de la création',
      error: err.message 
    });
  }
};

exports.supprimer = async (id) => {
  await db.promise().query('DELETE FROM evenement WHERE id = ?', [id]);
};

exports.getByOrganisateur = async (organisateur_id) => {
  const [rows] = await db.promise().query(
    'SELECT * FROM evenement WHERE organisateur_id = ?',
    [organisateur_id]
  );
  return rows;
};

exports.getAllEvenements = async () => {
  const [rows] = await db.promise().query('SELECT * FROM evenement');
  return rows;
};

exports.getById = async (id) => {
  const [rows] = await db.promise().query(
    'SELECT * FROM evenement WHERE id = ?', 
    [id]
  );
  return rows[0];
};

exports.modifier = async (id, { titre, description, date, heure, type, duree, lieu, prix_ticket, nombre_places, places_disponibles }) => {
  await db.promise().query(
    `UPDATE evenement 
     SET titre = ?, description = ?, date_evt = ?, heure = ?, type = ?, duree = ?, lieu = ?, 
         prix_ticket = ?, nombre_places = ?, places_disponibles = ?
     WHERE id = ?`,
    [titre, description, date, heure, type, duree, lieu, prix_ticket, nombre_places, places_disponibles, id]
  );
};
