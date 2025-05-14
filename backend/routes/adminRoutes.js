const express = require('express');
const router = express.Router();
const { checkAdmin } = require('../middleware/authMiddleware');
const oeuvreController = require('../controllers/oeuvreController');
const evenementController = require('../controllers/evenementController');

router.get('/oeuvres/en-attente', checkAdmin, oeuvreController.getOeuvresEnAttente);
router.put('/oeuvres/:id/approuver', checkAdmin, oeuvreController.approuverOeuvre);
router.put('/oeuvres/:id/rejeter', checkAdmin, oeuvreController.rejeterOeuvre);

router.get('/evenements/en-attente', checkAdmin, evenementController.getEvenementsEnAttente);
router.put('/evenements/:id/approuver', checkAdmin, evenementController.approuverEvenement);
router.put('/evenements/:id/rejeter', checkAdmin, evenementController.rejeterEvenement);

module.exports = router;