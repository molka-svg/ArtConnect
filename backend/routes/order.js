const express = require('express');
const router = express.Router();
const connection = require('../config/database');
const jwt = require('jsonwebtoken');

// Middleware pour vérifier le token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    console.log('Aucun token fourni');
    return res.status(401).json({ message: 'Accès non autorisé' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret', (err, user) => {
    if (err) {
      console.log('Token invalide:', err.message);
      return res.status(403).json({ message: 'Token invalide' });
    }
    console.log('Utilisateur authentifié:', user);
    req.user = user;
    next();
  });
};

// GET /api/orders/history
router.get('/history', authenticateToken, (req, res) => {
  const userId = req.user.id;
  console.log('Récupération des commandes pour user_id:', userId);

  const query = `
    SELECT 
      o.id, o.total, o.status, o.payment_method, o.created_at,
      oi.artwork_id, oi.prix, oi.quantite
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
    WHERE o.user_id = ?
    ORDER BY o.created_at DESC
  `;

  connection.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Erreur SQL:', err);
      return res.status(500).json({ message: 'Erreur serveur', error: err.message });
    }

    console.log('Résultats SQL:', results);

    // Formatter les commandes
    const ordersMap = new Map();
    results.forEach(row => {
      if (!ordersMap.has(row.id)) {
        ordersMap.set(row.id, {
          id: row.id,
          date: row.created_at,
          total: parseFloat(row.total),
          status: row.status,
          payment_method: row.payment_method,
          items: [],
        });
      }
      if (row.artwork_id) {
        ordersMap.get(row.id).items.push({
          artwork_id: row.artwork_id,
          titre: `Œuvre ${row.artwork_id}`, // À remplacer si table artworks existe
          prix: parseFloat(row.prix),
          quantite: row.quantite,
        });
      }
    });

    const orders = Array.from(ordersMap.values());
    console.log('Commandes formatées:', orders);

    res.status(200).json({ orders });
  });
});

module.exports = router;