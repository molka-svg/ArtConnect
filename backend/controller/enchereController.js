const db = require('../config/db');
exports.creerEnchere = async (req, res) => {
  try {
    const { titre, description, image, mise_de_depart, increment = 10, date_debut, date_fin } = req.body;
    const artiste_id = req.user.userid;

    // Conversion des dates au format MySQL (YYYY-MM-DD HH:MM:SS)
    const formatDateForSQL = (dateString) => {
      const date = new Date(dateString);
      return date.toISOString().slice(0, 19).replace('T', ' ');
    };

    // Insertion de l'œuvre
    const [oeuvreResult] = await db.promise().query(
      'INSERT INTO oeuvres (titre, description, image, artiste_id, prix, type, statut) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [titre, description, image, artiste_id, mise_de_depart, 'enchere', 'en_attente']
    );

    // Insertion de l'enchère avec dates formatées
    const [enchereResult] = await db.promise().query(
      'INSERT INTO enchere (oeuvre_id, mise_de_depart, increment, date_debut, date_fin, signature_validation, est_validee) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [
        oeuvreResult.insertId, 
        mise_de_depart, 
        increment,
        formatDateForSQL(date_debut),
        formatDateForSQL(date_fin),
        false, 
        false
      ]
    );

    res.status(201).json({ 
      message: 'Enchère créée avec succès',
      id: enchereResult.insertId
    });

  } catch (err) {
    console.error('Erreur détaillée creerEnchere:', err);
    res.status(500).json({ 
      message: 'Erreur serveur',
      error: err.message
    });
  }
};

exports.placerMise = async (req, res) => {
  const { enchere_id, utilisateur_id, montant } = req.body;

  if (!enchere_id || !utilisateur_id || !montant) {
    return res.status(400).json({ message: 'Tous les champs sont requis' });
  }

  const conn = await db.promise().getConnection();
  try {
    await conn.beginTransaction();

    const [result] = await conn.query(
      `SELECT mise_de_depart, increment, (SELECT MAX(montant) FROM mises WHERE enchere_id = ?) as max_mise
       FROM enchere 
       WHERE enchere_id = ? AND date_fin > NOW() AND est_validee = TRUE`,
      [enchere_id, enchere_id]
    );

    if (result.length === 0) {
      return res.status(400).json({ message: 'Enchère non valide ou terminée' });
    }

    const { mise_de_depart, increment, max_mise } = result[0];
    const minMise = max_mise ? max_mise + increment : mise_de_depart;

    if (montant < minMise) {
      return res.status(400).json({ message: `Le montant doit être au moins ${minMise}` });
    }

    await conn.query(
      'INSERT INTO mises (enchere_id, utilisateur_id, montant) VALUES (?, ?, ?)',
      [enchere_id, utilisateur_id, montant]
    );

    await conn.commit();

    if (req.app.get('io')) {
      req.app.get('io').emit('miseUpdate', {
        enchere_id,
        utilisateur_id,
        montant,
        date_mise: new Date()
      });
    }

    res.status(201).json({ message: 'Mise placée avec succès' });

  } catch (err) {
    await conn.rollback();
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  } finally {
    conn.release();
  }
};

exports.getEncheresByArtiste = async (req, res) => {
  const { artiste_id } = req.params;

  try {
    const [results] = await db.promise().query(
      `SELECT e.*, o.titre, o.image 
       FROM enchere e
       JOIN oeuvres o ON e.oeuvre_id = o.oeuvre_id
       WHERE o.artiste_id = ?`,
      [artiste_id]
    );
    res.status(200).json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};
exports.getEncheresActives = async (req, res) => {
  try {
    const [results] = await db.promise().query(
      `SELECT e.*, o.titre, o.image, o.description, CONCAT(u.prenom, ' ', u.nom) as artiste_nom
       FROM enchere e
       JOIN oeuvres o ON e.oeuvre_id = o.oeuvre_id
       JOIN users u ON o.artiste_id = u.userid
       WHERE e.date_fin > NOW() 
         AND e.est_validee = TRUE
         AND o.statut = 'approuve'
       ORDER BY e.date_fin ASC`
    );
    res.status(200).json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.getEnchereDetails = async (req, res) => {
  const { enchere_id } = req.params;

  try {
    const [results] = await db.promise().query(
      `SELECT e.*, o.*, CONCAT(u.prenom, ' ', u.nom) as artiste_nom
       FROM enchere e
       JOIN oeuvres o ON e.oeuvre_id = o.oeuvre_id
       JOIN users u ON o.artiste_id = u.userid
       WHERE e.enchere_id = ?`,
      [enchere_id]
    );

    if (results.length === 0) {
      return res.status(404).json({ message: 'Enchère non trouvée' });
    }
    res.status(200).json(results[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.getMisesByEnchere = async (req, res) => {
  const { enchere_id } = req.params;

  try {
    const [results] = await db.promise().query(
      `SELECT m.*, CONCAT(u.prenom, ' ', u.nom) as utilisateur_nom
       FROM mises m
       JOIN users u ON m.utilisateur_id = u.userid
       WHERE m.enchere_id = ?
       ORDER BY m.montant DESC`,
      [enchere_id]
    );
    res.status(200).json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};