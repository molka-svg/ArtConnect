const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../model/userModel');

const register = (req, res) => {
  const user = req.body; 
  console.log("Utilisateur reçu :", user); 

  bcrypt.hash(user.password, 10, (err, hash) => {
    if (err) {
      console.error('Erreur de hashage :', err); 
      return res.status(500).json({ error: 'Erreur de hashage' });
    }

    user.password = hash;  

    userModel.createUser(user, (err, result) => {
      if (err) {
        console.error('Erreur SQL:', err); 
        return res.status(500).json({ error: 'Erreur SQL', details: err.message });
      }
      res.status(201).json({ message: 'Utilisateur créé' });
    });
  });
};


const login = (req, res) => {
  const { email, password } = req.body;

  userModel.findByEmail(email, (err, results) => {
    if (err) {
      console.error('Erreur SQL:', err);  
      return res.status(500).json({ error: 'Erreur SQL' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    const user = results[0];

    bcrypt.compare(password, user.password, (err, match) => {
      if (err) {
        console.error('Erreur lors de la comparaison des mots de passe:', err);  
        return res.status(500).json({ error: 'Erreur interne' });
      }

      if (!match) {
        return res.status(401).json({ error: 'Mot de passe incorrect' });
      }

      const token = jwt.sign({ id: user.userid, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

      res.json({
        message: 'Connexion réussie',
        token,
        user: {
          id: user.userid,
          nom: user.nom,
          email: user.mail,  
          role: user.role
        }
      });
    });
  });
};

module.exports = {
  register,
  login
};
