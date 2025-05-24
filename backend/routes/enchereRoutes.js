const express = require('express');
const router = express.Router();
const enchereController = require('../controller/enchereController');

// Créer une enchère
router.post('/create', enchereController.creerEnchere);

// Placer une mise
router.post('/mise', enchereController.placerMise);

module.exports = router;
