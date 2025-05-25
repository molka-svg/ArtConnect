const db = require('../config/db');

exports.createEnchere = (enchere, callback) => {
  const sql = `
    INSERT INTO enchere (oeuvre_id, mise_de_depart, increment, date_debut, date_fin, signature_validation)
    VALUES (?, ?, ?, ?, ?, ?)`;
  const values = [
    enchere.oeuvre_id,
    enchere.mise_de_depart,
    enchere.increment,
    enchere.date_debut,
    enchere.date_fin,
    enchere.signature_validation
  ];
  db.query(sql, values, callback);

};
exports.getEnchereById = (enchere_id, callback) => {
  const sql = `SELECT * FROM enchere WHERE enchere_id = ? AND date_fin > NOW() AND est_validee = TRUE`;
  db.query(sql, [enchere_id], callback);
};
exports.getEncheresByArtiste = (artiste_id, callback) => {
  const sql = `
    SELECT e.*, o.titre, o.image 
    FROM enchere e
    JOIN oeuvres o ON e.oeuvre_id = o.oeuvre_id
    WHERE o.artiste_id = ?`;
  db.query(sql, [artiste_id], callback);
};

exports.getEncheresActives = (callback) => {
  const sql = `
    SELECT e.*, o.titre, o.image, o.description, u.nom as artiste_nom
    FROM enchere e
    JOIN oeuvres o ON e.oeuvre_id = o.oeuvre_id
    JOIN users u ON o.artiste_id = u.userid
    WHERE e.date_fin > NOW() AND e.est_validee = TRUE
    ORDER BY e.date_fin ASC`;
  db.query(sql, callback);
};

exports.getEnchereDetails = (enchere_id, callback) => {
  const sql = `
    SELECT e.*, o.*, u.nom as artiste_nom, u.prenom as artiste_prenom
    FROM enchere e
    JOIN oeuvres o ON e.oeuvre_id = o.oeuvre_id
    JOIN users u ON o.artiste_id = u.userid
    WHERE e.enchere_id = ?`;
  db.query(sql, [enchere_id], callback);
};
