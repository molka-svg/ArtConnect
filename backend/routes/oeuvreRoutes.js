const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleWare/authMiddleWare');
const oeuvreController = require('../controller/oeuvreController'); 

router.post('/add', verifyToken, oeuvreController.ajouterOeuvre);
router.get('/mes-oeuvres', verifyToken, oeuvreController.getOeuvresByArtiste); 
router.delete('/delete/:id', verifyToken, oeuvreController.supprimerOeuvre);
router.get('/edit-artwork/:id', oeuvreController.getOeuvreById);
router.get('/all', oeuvreController.getAllOeuvres);

module.exports = router;
