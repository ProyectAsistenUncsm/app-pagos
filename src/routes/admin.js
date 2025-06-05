const express = require('express');
import {realizado} from '../controllers/paymentController.js';

const router = express.Router();
// Historial de pagos
router.get('/admin/historial', async (req, res) => {
  try {
    const pagos = await Pago.find().sort({ fecha: -1 });
    res.render('historial', { realizarPago });
  } catch (err) {
    res.status(500).send('Error al obtener historial');
  }
});

module.exports = router;
