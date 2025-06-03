const express = require('express');
import {Pay} from '../models/Pago';

const router = express.Router();
// Historial de pagos
router.get('/admin', async (req, res) => {
  try {
    const pagos = await Pago.find().sort({ fecha: -1 });
    res.render('historial', { Pay });
  } catch (err) {
    res.status(500).send('Error al obtener historial');
  }
});

module.exports = router;
