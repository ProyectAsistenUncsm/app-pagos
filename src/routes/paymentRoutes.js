import { Router } from 'express';
import { obtenerFacturasPendientes, cargarPaginaPago, realizarPago } from '../controllers/paymentController.js';
import { verificarToken } from '../middleware/authMiddleware.js';

const router = Router();

// Obtener facturas pendientes
router.get('/pendientes', verificarToken, obtenerFacturasPendientes);

// Cargar página de pago
router.get('/:pay_service_id', verificarToken, cargarPaginaPago);

// Realizar pago
router.post('/realizar', verificarToken, realizarPago);

export default router;
