const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const paymentController = require('../controller/paymentController');

router.post('/online', verifyToken, paymentController.createOnlinePayment);
router.post('/cash', verifyToken, paymentController.createCashPayment);

module.exports = router;