const express = require('express');
const router = express.Router();
const Pago = require('../models/Pago');

// Historial de pagos
router.get('/admin/historial-pagos', async (req, res) => {
  try {
    const pagos = await Pago.find().sort({ fecha: -1 });
    res.render('historial', { pagos });
  } catch (err) {
    res.status(500).send('Error al obtener historial');
  }
});

module.exports = router;
