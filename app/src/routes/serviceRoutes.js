const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const { verificarToken } = require('../middleware/authMiddleware');

// Ruta para obtener todos los servicios
router.get('/', serviceController.obtenerServicios);

// Ruta para vincular un servicio a un usuario
router.post('/vincular', verificarToken, serviceController.vincularServicio);

// Ruta para desvincular un servicio de un usuario
router.post('/desvincular', verificarToken, serviceController.desvincularServicio);

module.exports = router;
