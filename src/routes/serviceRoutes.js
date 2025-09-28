import { Router } from 'express';
import { obtenerServicios, vincularServicio, desvincularServicio } from '../controllers/serviceController.js';
import { verificarToken } from '../middleware/authMiddleware.js';
import { obtenerNotificacionesFacturas } from '../controllers/facturaController.js';

const router = Router();

// Ruta para obtener todos los servicios
router.get('/', obtenerServicios);

// Ruta para la página de notificaciones
router.get('/notification', verificarToken, (req, res) => {
    res.render('notifications', { 
        usuario: req.user,
        title: 'Notificaciones',
        activePage: 'notification'
    });
});

// Ruta para obtener notificaciones de facturas
router.get('/notification/facturas', verificarToken, obtenerNotificacionesFacturas);

// Ruta para vincular un servicio a un usuario
router.post('/vincular', verificarToken, vincularServicio);

// Ruta para desvincular un servicio de un usuario
router.post('/desvincular', verificarToken, desvincularServicio);

export default router;
