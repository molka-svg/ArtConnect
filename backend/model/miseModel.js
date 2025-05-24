const db = require('../config/db');

exports.placerMise = (mise, callback) => {
  // Vérifier si l'enchère existe et est active
  const checkEnchereSql = `
    SELECT mise_de_depart, increment, (SELECT MAX(montant) FROM mises WHERE enchere_id = ?) as max_mise
    FROM enchere 
    WHERE enchere_id = ? AND date_fin > NOW() AND est_validee = TRUE`;
  
  db.query(checkEnchereSql, [mise.enchere_id, mise.enchere_id], (err, result) => {
    if (err || result.length === 0) {
      return callback(new Error('Enchère non valide ou terminée'), null);
    }

    const { mise_de_depart, increment, max_mise } = result[0];
    const minMise = max_mise ? max_mise + increment : mise_de_depart;

    // Vérifier si le montant de la mise est valide
    if (mise.montant < minMise) {
      return callback(new Error(`Le montant doit être supérieur ou égal à ${minMise}`), null);
    }

    // Insérer la mise
    const sql = `
      INSERT INTO mises (enchere_id, utilisateur_id, montant)
      VALUES (?, ?, ?)`;
    const values = [mise.enchere_id, mise.utilisateur_id, mise.montant];
    db.query(sql, values, callback);
  });
};