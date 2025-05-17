const Order = require('../model/orderModel');
exports.createOnlinePayment = async (req, res) => {
  console.log('Requête reçue:', req.body); // Log des données reçues
  console.log('Utilisateur:', req.user); // Log de req.user
  try {
    const { userCin, total, panier, cardType, phone, cardNumber } = req.body;
    const userId = req.user?.userid;

    // Valider les données
    if (!userId) {
      console.log('Erreur: userId manquant');
      return res.status(401).json({ message: 'Utilisateur non authentifié' });
    }
    if (!userCin || !total || !panier || !panier.length || !cardType || !phone || !cardNumber) {
      console.log('Erreur: Données manquantes', { userCin, total, panier, cardType, phone, cardNumber });
      return res.status(400).json({ message: 'Données manquantes' });
    }
    // Valider chaque élément du panier
    for (const item of panier) {
      if (!item.id || !item.prix || !item.quantite) {
        console.log('Erreur: Élément du panier invalide', item);
        return res.status(400).json({ message: 'Élément du panier invalide' });
      }
    }

    // Créer la commande
    console.log('Création de la commande pour userId:', userId);
    const orderId = await Order.create({
      user_id: userId,
      user_cin: userCin,
      payment_method: 'online',
      total,
    });

    // Enregistrer les articles
    console.log('Enregistrement des articles pour orderId:', orderId);
    await Order.createItems(orderId, panier);

    res.status(201).json({
      message: 'Commande enregistrée avec succès. Vous recevrez une confirmation bientôt.',
      id: orderId,
    });
  } catch (err) {
    console.error('Erreur lors du paiement en ligne:', err);
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

exports.createCashPayment = async (req, res) => {
  console.log('Requête reçue:', req.body);
  console.log('Utilisateur:', req.user);
  try {
    const { userCin, total, address, phone, panier } = req.body;
    const userId = req.user?.userid;

    // Valider les données
    if (!userId) {
      console.log('Erreur: userId manquant');
      return res.status(401).json({ message: 'Utilisateur non authentifié' });
    }
    if (!userCin || !total || !address || !phone || !panier || !panier.length) {
      console.log('Erreur: Données manquantes', { userCin, total, address, phone, panier });
      return res.status(400).json({ message: 'Données manquantes' });
    }
    // Valider chaque élément du panier
    for (const item of panier) {
      if (!item.id || !item.prix || !item.quantite) {
        console.log('Erreur: Élément du panier invalide', item);
        return res.status(400).json({ message: 'Élément du panier invalide' });
      }
    }

    // Créer la commande
    console.log('Création de la commande pour userId:', userId);
    const orderId = await Order.create({
      user_id: userId,
      user_cin: userCin,
      payment_method: 'cash',
      total,
      address,
    });

    // Enregistrer les articles
    console.log('Enregistrement des articles pour orderId:', orderId);
    await Order.createItems(orderId, panier);

    res.status(201).json({
      message: 'Commande enregistrée avec succès. Vous recevrez une confirmation bientôt.',
      id: orderId,
    });
  } catch (err) {
    console.error('Erreur lors du paiement cash: cntroller ', err);
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};