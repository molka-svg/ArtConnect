const db = require('../config/db');

const createUser = (user, callback) => {
  const sql = 'INSERT INTO users (nom, prenom, telephone, mail, password, role, gender, date_naissance) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
  db.query(sql, [
    user.nom,
    user.prenom,
    user.telephone,
    user.mail,
    user.password, 
    user.role,
    user.gender,
    user.date_naissance
  ], callback);
};

const findByEmail = (mail, callback) => {
  db.query('SELECT * FROM users WHERE mail = ?', [mail], callback);
};

module.exports = {
  createUser,
  findByEmail
};
