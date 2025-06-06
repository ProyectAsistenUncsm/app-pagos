import { Router } from 'express';
import { cargarPaginaPago, realizarPago, obtenerHistorialPagos } from '../controllers/paymentController.js';
import { verificarToken } from '../middleware/authMiddleware.js';
import { PayService } from '../models/indexModel.js';
import { vistaPerfil } from '../controllers/userController.js';

const router = Router();

// Ruta principal
router.get('/', (req, res) => {
    if (req.user) {
        res.render('index', { usuario: req.user });
    } else {
        res.redirect('/auth/login');
    }
});

// Ruta para verificar servicios de pago
router.get('/pay_services', verificarToken, async (req, res) => {
    try {
        const payServices = await PayService.findAll({
            attributes: ['id', 'nombre', 'descripcion']
        });
        
        res.json({
            mensaje: 'Servicios de pago encontrados',
            payServices
        });
    } catch (error) {
        console.error('Error al obtener servicios de pago:', error);
        res.status(500).json({
            mensaje: 'Error al obtener los servicios de pago',
            error: error.message
        });
    }
});

// Rutas protegidas (requieren autenticación)
router.get('/perfil', (req, res) => {
    if (!req.user) {
        return res.redirect('/auth/login');
    }
    res.render('perfil', { usuario: req.user });
});

router.get('/register', (req, res) => {
    if (!req.user) {
        return res.redirect('/auth/register');
    }
    res.render('register', { usuario: req.user });
});

// Rutas de autenticación
router.get('/login', (req, res) => res.render('auth/login'));
router.get('/register', (req, res) => res.render('auth/register'));
router.get('/vincular-service', (req, res) => res.render('auth/vincular-service'));
router.get('/recover', (req, res) => res.render('recover'));

// Ruta para el historial de pagos
router.get('/historial', verificarToken, obtenerHistorialPagos);

export default router;