const express = require('express');
const router = express.Router();
const { realizarPago } = require('../controllers/paymentController');
const auth = require('../middleware/authMiddleware');

router.post('/realizar', auth, realizarPago);

module.exports = router;
