const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../model/userModel');

const register = (req, res) => {
  const user = req.body;
  bcrypt.hash(user.password, 10, (err, hash) => {
    if (err) return res.status(500).json({ error: 'Erreur de hashage' });
    user.password = hash;
    userModel.createUser(user, (err) => {
      if (err) return res.status(500).json({ error: 'Erreur SQL', details: err.message });
      res.status(201).json({ message: 'Utilisateur créé' });
    });
  });
};
 
const login = (req, res) => {
  const { mail, password } = req.body;
  userModel.findByEmail(mail, (err, results) => {
    if (err) return res.status(500).json({ error: 'Erreur SQL' });
    if (results.length === 0) return res.status(404).json({ error: 'Utilisateur non trouvé' });

    const user = results[0];
    bcrypt.compare(password, user.password, (err, match) => {
      if (err) return res.status(500).json({ error: 'Erreur interne' });
      if (!match) return res.status(401).json({ error: 'Mot de passe incorrect' });

      const token = jwt.sign(
        { id: user.userid, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' } // reste connecté 7 jours
      );

      res.json({
        message: 'Connexion réussie',
        token,
        user: {
          id: user.userid,
          nom: user.nom,
          mail: user.mail,
          role: user.role
        }
      });
    });
  });
};

const getProfile = (req, res) => {
  res.status(200).json({ user: req.user });
};


module.exports = { register, login, getProfile };
