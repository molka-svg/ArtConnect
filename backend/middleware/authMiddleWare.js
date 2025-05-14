const jwt = require('jsonwebtoken');
const db = require('../config/db');

const verifyToken = async (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token manquant ou invalide' });
  }

  const token = header.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const [rows] = await db.promise().query('SELECT * FROM users WHERE userid = ?', [decoded.id]);

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Utilisateur introuvable' });
    }

    req.user = rows[0]; // user.userid, user.role, etc.
    next();
  } catch (err) {
    console.error("Erreur de vérification du token:", err);
    res.status(401).json({ message: 'Token invalide' });
  }
};

// Middleware pour vérifier le rôle
const requireRole = (role) => {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ message: 'Accès interdit : rôle insuffisant' });
    }
    next();
  };
};

module.exports = {
  verifyToken,
  requireRole
};
function checkAdmin(req, res, next) {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  res.status(403).json({ message: 'Accès réservé aux administrateurs' });
}

module.exports = { checkAdmin,verifyToken };