import { Router } from 'express';
import { cargarPaginaPago, realizarPago, obtenerHistorialPagos } from '../controllers/paymentController.js';
import { verificarToken } from '../middleware/authMiddleware.js';
import { PayService, Factura } from '../models/indexModel.js';
import { vistaPerfil } from '../controllers/userController.js';

const router = Router();

// Ruta principal
router.get('/', verificarToken, async (req, res) => {
    try {
        // Obtener las facturas del usuario
        const facturas = await Factura.findAll({
            where: { usuario_id: req.user.id },
            include: [{
                model: PayService,
                attributes: ['nombre', 'descripcion']
            }],
            order: [['createdAt', 'DESC']]
        });

        // Log para depuración
        console.log('Facturas encontradas:', facturas.map(f => ({
            id: f.id,
            servicio: f.PayService.nombre,
            estado: f.estado,
            fecha_vencimiento: f.fecha_vencimiento,
            fecha_actual: new Date(),
            esta_vencida: new Date(f.fecha_vencimiento) < new Date()
        })));

        res.render('index', { 
            usuario: req.user,
            facturas: facturas
        });
    } catch (error) {
        console.error('Error al cargar la página principal:', error);
        res.status(500).render('error', {
            mensaje: 'Error al cargar la página principal',
            usuario: req.user
        });
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

// Ruta para el panel de administración
router.get('/admin', verificarToken, (req, res) => {
    if (req.user.rol_id !== 1) {
        return res.status(403).render('error', {
            mensaje: 'No tienes permisos para acceder a esta página',
            usuario: req.user
        });
    }
    res.render('admin', { 
        usuario: req.user,
        title: 'Panel de Administración'
    });
});

export default router;