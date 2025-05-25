const express = require('express');
const router = express.Router();
const enchereController = require('../controller/enchereController');

// Créer une enchère
router.post('/create', enchereController.creerEnchere); // Line 6
// Placer une mise
router.post('/mise', enchereController.placerMise); // Line 9 (likely the source of the error)
router.get('/artiste/:artiste_id', enchereController.getEncheresByArtiste);
router.get('/actives', enchereController.getEncheresActives);
router.get('/:enchere_id', enchereController.getEnchereDetails);
router.get('/:enchere_id/mises', enchereController.getMisesByEnchere);
module.exports = router;