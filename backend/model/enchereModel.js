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
