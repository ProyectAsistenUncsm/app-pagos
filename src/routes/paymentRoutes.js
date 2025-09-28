import express from 'express';
import { obtenerFacturasPendientes, cargarPaginaPago, realizarPago } from '../controllers/paymentController.js';
import { verificarToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Obtener facturas pendientes
router.get('/pendientes', verificarToken, obtenerFacturasPendientes);

// Ruta para cargar la página de pago
router.get('/:id', verificarToken, cargarPaginaPago);

// Ruta para procesar el pago
router.post('/realizar', verificarToken, realizarPago);

export default router;
