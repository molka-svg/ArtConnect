const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../model/userModel');

// Générer un code aléatoire à 6 chiffres
const generateResetCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Inscription
const register = (req, res) => {
  const user = req.body;
  console.log('Inscription pour:', user.mail);
  bcrypt.hash(user.password, 10, (err, hash) => {
    if (err) {
      console.error('Erreur hashage:', err);
      return res.status(500).json({ error: 'Erreur de hashage' });
    }
    user.password = hash;
    userModel.createUser(user, (err) => {
      if (err) {
        console.error('Erreur createUser:', err);
        return res.status(500).json({ error: 'Erreur SQL', details: err.message });
      }
      res.status(201).json({ message: 'Utilisateur créé' });
    });
  });
};

// Connexion
const login = (req, res) => {
  const { mail, password } = req.body;
  console.log('Connexion pour:', mail);
  userModel.findByEmail(mail, (err, results) => {
    if (err) {
      console.error('Erreur findByEmail:', err);
      return res.status(500).json({ error: 'Erreur SQL', details: err.message });
    }
    if (results.length === 0) {
      console.log('Utilisateur non trouvé:', mail);
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    const user = results[0];
    bcrypt.compare(password, user.password, (err, match) => {
      if (err) {
        console.error('Erreur comparaison mot de passe:', err);
        return res.status(500).json({ error: 'Erreur interne' });
      }
      if (!match) {
        console.log('Mot de passe incorrect pour:', mail);
        return res.status(401).json({ error: 'Mot de passe incorrect' });
      }

      const token = jwt.sign(
        { id: user.userid, role: user.role },
        process.env.JWT_SECRET || 'your_jwt_secret',
        { expiresIn: '7d' }
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

// Profil
const getProfile = (req, res) => {
  console.log('Récupération profil pour userId:', req.user?.id);
  res.status(200).json({ user: req.user });
};

// Demander un code de réinitialisation
const forgotPassword = (req, res) => {
  const { mail } = req.body;
  console.log('Demande de réinitialisation pour mail:', mail);

  if (!mail) {
    console.log('Email manquant dans la requête');
    return res.status(400).json({ message: 'Email requis' });
  }

  userModel.findByEmail(mail, (err, results) => {
    if (err) {
      console.error('Erreur findByEmail:', err);
      return res.status(500).json({ message: 'Erreur serveur', details: err.message });
    }

    if (results.length === 0) {
      console.log('Utilisateur non trouvé:', mail);
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    const user = results[0];
    const resetCode = generateResetCode();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    userModel.createResetCode(user.userid, resetCode, expiresAt, (err) => {
      if (err) {
        console.error('Erreur createResetCode:', err);
        return res.status(500).json({ message: 'Erreur serveur', details: err.message });
      }

      console.log(`Code de réinitialisation pour ${mail}: ${resetCode}`);
      res.status(200).json({ message: 'Code de réinitialisation envoyé' });
    });
  });
};

// Vérifier le code
const verifyCode = (req, res) => {
  const { mail, code } = req.body;
  console.log('Vérification code pour mail:', mail, 'Code:', code);

  if (!mail || !code) {
    console.log('Email ou code manquant dans la requête');
    return res.status(400).json({ message: 'Email et code requis' });
  }

  userModel.verifyResetCode(mail, code, (err, results) => {
    if (err) {
      console.error('Erreur verifyResetCode:', err);
      return res.status(500).json({ message: 'Erreur serveur', details: err.message });
    }

    if (results.length === 0) {
      console.log('Code invalide ou expiré:', code);
      return res.status(400).json({ message: 'Code invalide ou expiré' });
    }

    res.status(200).json({ message: 'Code vérifié' });
  });
};

// Réinitialiser le mot de passe
const resetPassword = async (req, res) => {
  const { mail, code, newPassword } = req.body;
  console.log('Réinitialisation mot de passe pour mail:', mail);

  if (!mail || !code || !newPassword) {
    console.log('Email, code ou mot de passe manquant dans la requête');
    return res.status(400).json({ message: 'Email, code et mot de passe requis' });
  }

  userModel.verifyResetCode(mail, code, async (err, results) => {
    if (err) {
      console.error('Erreur verifyResetCode:', err);
      return res.status(500).json({ message: 'Erreur serveur',本当に, details: err.message });
    }

    if (results.length === 0) {
      console.log('Code invalide ou expiré:', code);
      return res.status(400).json({ message: 'Code invalide ou expiré' });
    }

    const user = results[0];
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    userModel.updatePassword(user.userid, hashedPassword, (err) => {
      if (err) {
        console.error('Erreur updatePassword:', err);
        return res.status(500).json({ message: 'Erreur serveur', details: err.message });
      }

      userModel.deleteResetCodes(user.userid, (err) => {
        if (err) console.error('Erreur deleteResetCodes:', err);
      });
      res.status(200).json({ message: 'Mot de passe réinitialisé' });
    });
  });
};

module.exports = { register, login, getProfile, forgotPassword, verifyCode, resetPassword };