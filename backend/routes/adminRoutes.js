const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware'); 
const oeuvreController = require('../controller/oeuvreController'); 

router.post('/add', verifyToken, oeuvreController.ajouterOeuvre);
router.get('/mes-oeuvres', verifyToken, oeuvreController.getOeuvresByArtiste); 
router.delete('/delete/:id', verifyToken, oeuvreController.supprimerOeuvre);
router.get('/edit-artwork/:id', oeuvreController.getOeuvreById);
router.put('/modifier/:id', verifyToken, oeuvreController.modifierOeuvre);
router.get('/all', oeuvreController.getAllOeuvres);
 
router.get('/oeuvres/en-attente', verifyToken, oeuvreController.getOeuvresEnAttente);
router.put('/oeuvres/approuver/:id', verifyToken, oeuvreController.approuverOeuvre);
router.put('/oeuvres/rejeter/:id', verifyToken, oeuvreController.rejeterOeuvre);

module.exports = router;