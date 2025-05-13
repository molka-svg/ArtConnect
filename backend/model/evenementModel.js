const db = require('../config/db');
exports.ajouter = async (data) => {
  const params = [
    data.titre,
    data.description,
    data.date_evt,
    data.heure,
    data.type,
    data.duree,
    data.lieu,
    data.prix_ticket,
    data.nombre_places,
    data.nombre_places, 
    data.organisateur_id
  ];

  console.log('Paramètres SQL:', params);

  const sql = `
    INSERT INTO evenement 
    (titre, description, date_evt, heure, type, duree, lieu, prix_ticket, nombre_places, places_disponibles, organisateur_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  const [result] = await db.promise().execute(sql, params);
  return result.insertId;
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
