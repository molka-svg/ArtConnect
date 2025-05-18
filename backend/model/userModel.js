const db = require('../config/db');

const userModel = {
  createUser: (user, callback) => {
    const sql = 'INSERT INTO users (nom, prenom, telephone, mail, password, role, gender, date_naissance) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    console.log('Exécution createUser pour mail:', user.mail);
    db.query(sql, [
      user.nom,
      user.prenom,
      user.telephone,
      user.mail,
      user.password,
      user.role || 'user',
      user.gender,
      user.date_naissance
    ], callback);
  },

  findByEmail: (mail, callback) => {
    console.log('Exécution findByEmail pour mail:', mail);
    db.query('SELECT * FROM users WHERE mail = ?', [mail], (err, results) => {
      if (err) console.error('Erreur findByEmail:', err);
      callback(err, results);
    });
  },

  createResetCode: (userId, code, expiresAt, callback) => {
    const sql = 'INSERT INTO reset_codes (user_id, code, created_at, expires_at) VALUES (?, ?, NOW(), ?)';
    console.log('Exécution createResetCode pour userId:', userId, 'code:', code);
    db.query(sql, [userId, code, expiresAt], (err, results) => {
      if (err) console.error('Erreur createResetCode:', err);
      callback(err, results);
    });
  },

  verifyResetCode: (mail, code, callback) => {
    const sql = `
      SELECT u.* 
      FROM reset_codes rc 
      JOIN users u ON rc.user_id = u.userid 
      WHERE u.mail = ? AND rc.code = ? AND rc.expires_at > NOW()
    `;
    console.log('Exécution verifyResetCode pour mail:', mail, 'code:', code);
    db.query(sql, [mail, code], (err, results) => {
      if (err) console.error('Erreur verifyResetCode:', err);
      callback(err, results);
    });
  },

  updatePassword: (userId, hashedPassword, callback) => {
    const sql = 'UPDATE users SET password = ? WHERE userid = ?';
    console.log('Exécution updatePassword pour userId:', userId);
    db.query(sql, [hashedPassword, userId], (err, results) => {
      if (err) console.error('Erreur updatePassword:', err);
      callback(err, results);
    });
  },

  deleteResetCodes: (userId, callback) => {
    const sql = 'DELETE FROM reset_codes WHERE user_id = ?';
    console.log('Exécution deleteResetCodes pour userId:', userId);
    db.query(sql, [userId], (err, results) => {
      if (err) console.error('Erreur deleteResetCodes:', err);
      callback(err, results);
    });
  }
};

module.exports = userModel;