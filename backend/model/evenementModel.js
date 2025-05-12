const db = require('../config/db');

exports.ajouter = async ({ titre, description, date, heure, type, duree, lieu, prix_ticket, nombre_places, places_disponibles, organisateur_id }) => {
  const sql = `
    INSERT INTO evenement 
    (nom, description, date_evt, heure, type, duree, lieu, prix_ticket, nombre_places, places_disponibles, organisateur_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const [result] = await db.promise().execute(sql, [
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
  ]);
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

exports.getAll = async () => {
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
     SET nom = ?, description = ?, date_evt = ?, heure = ?, type = ?, duree = ?, lieu = ?, 
         prix_ticket = ?, nombre_places = ?, places_disponibles = ?
     WHERE id = ?`,
    [titre, description, date, heure, type, duree, lieu, prix_ticket, nombre_places, places_disponibles, id]
  );
};
