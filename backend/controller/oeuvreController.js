const Oeuvre = require('../model/oeuvreModel');

exports.ajouterOeuvre = async (req, res) => {
  try {
    const { titre, description, prix, type, image } = req.body;
    const artiste_id = req.user.userid;
    const id = await Oeuvre.ajouter({ titre, description, prix, type, image, artiste_id });
    res.status(201).json({ message: 'Oeuvre ajoutée', id });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de l’ajout', error: err.message });
  }
};
exports.getOeuvresByArtiste = async (req, res) => {
    try {
      const artiste_id = req.user.userid;
      const oeuvres = await Oeuvre.getByArtisteId(artiste_id);
      res.json(oeuvres);
    } catch (err) {
      res.status(500).json({ message: 'Erreur lors de la récupération', error: err.message });
    }
  };
  exports.supprimerOeuvre = async (req, res) => {
    try {
      const id = req.params.id; // Récupère l'ID depuis l'URL
      await Oeuvre.supprimer(id); // Appel à la fonction de suppression
      res.json({ message: 'Œuvre supprimée avec succès' });
    } catch (err) {
      console.error("Erreur lors de la suppression : ", err);
      res.status(500).json({ message: 'Erreur serveur', error: err.message });
    }
  };
exports.getOeuvreById = (req, res) => {
    const { id } = req.params;
    res.send(`Oeuvre avec ID: ${id}`);
  };
  
exports.modifierOeuvre = async (req, res) => {
  try {
    const id = req.params.id;
    const oeuvre = await Oeuvre.getById(id);
    if (!oeuvre || oeuvre.artiste_id !== req.user.userid) {
      return res.status(403).json({ message: 'Non autorisé' });
    }

    await Oeuvre.modifier(id, req.body);
    res.json({ message: 'Oeuvre modifiée avec succès' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la modification', error: err.message });
  }
  const getOeuvreById = (req, res) => {
    const { id } = req.params; 
    const query = `SELECT * FROM oeuvres WHERE oeuvre_id = ?`;
    
    db.query(query, [id], (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Erreur serveur', error: err });
      }
      if (result.length === 0) {
        return res.status(404).json({ message: 'Œuvre non trouvée' });
      }
      res.status(200).json(result[0]); 
    });
  };
  
};
