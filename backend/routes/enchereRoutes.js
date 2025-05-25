const express = require('express');
const router = express.Router();
const enchereController = require('../controller/enchereController');
const { verifyToken } = require('../middleware/authMiddleware'); 

// Créer une enchère
router.post('/create', verifyToken,enchereController.creerEnchere); // Line 6
// Placer une mise
router.post('/mise', enchereController.placerMise); // Line 9 (likely the source of the error)
router.get('/artiste/:artiste_id', enchereController.getEncheresByArtiste);
router.get('/actives', enchereController.getEncheresActives);
router.get('/:enchere_id', enchereController.getEnchereDetails);
router.get('/:enchere_id/mises',verifyToken, enchereController.getMisesByEnchere);
module.exports = router;