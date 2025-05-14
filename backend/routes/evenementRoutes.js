const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');  // Assurez-vous que le chemin correspond au fichier renommé
const evenementController = require('../controller/evenementController');

router.post('/add', verifyToken, evenementController.ajouterEvenement);
router.get('/mes-evenements', verifyToken, evenementController.getEvenementsByOrganisateur);
router.get('/all', evenementController.getAllEvenements);
router.get('/:id', evenementController.getEvenementById);
router.put('/edit/:id', verifyToken, evenementController.modifierEvenement);
router.delete('/delete/:id', verifyToken, evenementController.supprimerEvenement);

module.exports = router;
