const express = require('express');
const router = express.Router();
const Historial = require('../models/historial');

// Obtener el historial de pagos de un usuario
router.get('/:usuarioId', async (req, res) => {
  try {
    const historial = await Historial.find({ usuarioId: req.params.usuarioId }).sort({ fechaPago: -1 });
    res.render('historial', { historial });
  } catch (error) {
    res.status(500).send('Error al obtener el historial de pagos.');
  }
});

module.exports = router;
