const db = require('../config/db');

exports.creerEnchere = async (req, res) => {
  const { 
    titre, description, image, artiste_id, // Champs pour l'œuvre
    mise_de_depart, increment = 10, date_debut = new Date().toISOString(), date_fin, signature_validation = false 
  } = req.body;

  // Validation des champs obligatoires
  if (!titre || !artiste_id || !mise_de_depart || !increment || !date_debut || !date_fin) {
    return res.status(400).json({ message: 'Tous les champs obligatoires (titre, artiste_id, mise_de_depart, increment, date_debut, date_fin) sont requis' });
  }

  // Validation des dates
  if (new Date(date_debut) >= new Date(date_fin)) {
    return res.status(400).json({ message: 'La date de fin doit être postérieure à la date de début' });
  }

  // Validation que l'utilisateur est un artiste
  if (req.user.role !== 'artiste') {
    return res.status(403).json({ message: 'Seuls les artistes peuvent créer des enchères' });
  }

  // Vérification que l'artiste_id correspond à l'utilisateur connecté
  if (artiste_id !== req.user.userid) {
    return res.status(403).json({ message: 'Vous ne pouvez créer une enchère que pour vos propres œuvres' });
  }

  let connection;
  try {
    // Démarrer une transaction
    connection = await db.promise().getConnection();
    await connection.beginTransaction();

    // Étape 1 : Créer l'œuvre avec statut 'enchere'
    const oeuvreData = {
      titre,
      description,
      image,
      artiste_id,
      prix: mise_de_depart, // Prix initial comme mise de départ
      type: 'enchere',
      statut: 'enchere' // Statut automatiquement défini comme 'enchere'
    };

    const [oeuvreResult] = await connection.query(
      'INSERT INTO oeuvres (titre, description, image, artiste_id, prix, type, statut) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [oeuvreData.titre, oeuvreData.description, oeuvreData.image, oeuvreData.artiste_id, oeuvreData.prix, oeuvreData.type, oeuvreData.statut]
    );

    // Étape 2 : Créer l'enchère avec l'oeuvre_id généré
    const enchereData = {
      oeuvre_id: oeuvreResult.insertId,
      mise_de_depart,
      increment,
      date_debut,
      date_fin,
      signature_validation,
      est_validee: false // Par défaut, l'enchère n'est pas validée
    };

    const [enchereResult] = await connection.query(
      'INSERT INTO enchere (oeuvre_id, mise_de_depart, increment, date_debut, date_fin, signature_validation, est_validee) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [enchereData.oeuvre_id, enchereData.mise_de_depart, enchereData.increment, enchereData.date_debut, enchereData.date_fin, enchereData.signature_validation, enchereData.est_validee]
    );

    // Valider la transaction
    await connection.commit();

    // Émettre un événement WebSocket pour informer les clients de la nouvelle enchère
    req.app.get('io').emit('nouvelleEnchere', {
      enchere_id: enchereResult.insertId,
      oeuvre_id: oeuvreResult.insertId,
      titre,
      mise_de_depart,
      date_debut,
      date_fin
    });

    res.status(201).json({ 
      message: 'Enchère et œuvre créées avec succès', 
      id: enchereResult.insertId,
      oeuvre_id: oeuvreResult.insertId 
    });
  } catch (err) {
    if (connection) {
      await connection.rollback();
    }
    console.error('Erreur lors de la création : ', err);
    res.status(500).json({ message: 'Erreur lors de la création de l\'enchère et de l\'œuvre', error: err.message });
  } finally {
    if (connection) {
      connection.release();
    }
  }
};