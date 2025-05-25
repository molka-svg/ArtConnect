const db = require('../config/db');

exports.ajouter = async (eventData) => {
  const [result] = await db.promise().query(
    `INSERT INTO evenement 
    (titre, description, date_evt, heure, type, duree, lieu, prix_ticket, nombre_places, places_disponibles, organisateur_id, statut) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      eventData.titre,
      eventData.description,
      eventData.date_evt,
      eventData.heure,
      eventData.type,
      eventData.duree,
      eventData.lieu,
      eventData.prix_ticket,
      eventData.nombre_places,
      eventData.places_disponibles,
      eventData.organisateur_id,
      eventData.statut
    ]
  );
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

exports.getById = async (id) => {
  const [rows] = await db.promise().query(
    'SELECT * FROM evenement WHERE id = ?', 
    [id]
  );
  return rows[0];
};

exports.modifier = async (id, eventData) => {
  await db.promise().query(
    `UPDATE evenement 
     SET titre = ?, description = ?, date_evt = ?, heure = ?, type = ?, duree = ?, lieu = ?, 
         prix_ticket = ?, nombre_places = ?, places_disponibles = ?
     WHERE id = ?`,
    [
      eventData.titre,
      eventData.description,
      eventData.date_evt,
      eventData.heure,
      eventData.type,
      eventData.duree,
      eventData.lieu,
      eventData.prix_ticket,
      eventData.nombre_places,
      eventData.places_disponibles,
      id
    ]
  );
};