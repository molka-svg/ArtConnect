const db = require('../config/db');

exports.ajouter = async ({ titre, description, prix, type, image, artiste_id }) => {
  const sql = `
    INSERT INTO oeuvres (titre, description, prix, type, image, artiste_id, date_creation)
    VALUES (?, ?, ?, ?, ?, ?, NOW())
  `;
  const [result] = await db.promise().execute(sql, [
    titre,
    description,
    prix,
    type,
    image,
    artiste_id
  ]);
  return result.insertId;
};
exports.supprimer = async (id) => {
  await db.promise().query('DELETE FROM oeuvres WHERE oeuvre_id = ?', [id]);
};

exports.getByArtisteId = async (artiste_id) => {
  const [rows] = await db.promise().query(
    'SELECT * FROM oeuvres WHERE artiste_id = ?',
    [artiste_id]
  );
  return rows;
};


exports.getById = async (id) => {
  const [rows] = await db.promise().query(
    'SELECT * FROM oeuvres WHERE oeuvre_id = ?', 
    [id]
  );
  return rows[0];
};

exports.modifier = async (id, { titre, description, prix, type, image }) => {
  await db.promise().query(
    `UPDATE oeuvres 
     SET titre = ?, description = ?, prix = ?, type = ?, image = ?
     WHERE oeuvre_id= ?`,
    [titre, description, prix, type, image, id]
  );
};
