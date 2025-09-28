import { Router } from 'express';
import { loginUsuario, registrarUsuario, logout, RecoverPassword } from '../controllers/authController.js';
import { vistaPerfil, cambiarContrasena } from '../controllers/userController.js';
import { verificarToken } from '../middleware/authMiddleware.js';

const router = Router();

// Middleware para redirigir usuarios autenticados
const redirigirAutenticados = (req, res, next) => {
    if (req.user) {
        return res.redirect('/');
    }
    next();
};

// Rutas de autenticación (vistas)
router.get('/register', redirigirAutenticados, (req, res) => res.render('register'));
router.get('/login', redirigirAutenticados, (req, res) => res.render('login'));
router.get('/recover', redirigirAutenticados, (req, res) => res.render('recover'));
router.get('/perfil', verificarToken, vistaPerfil);

// Endpoints de la API
router.post('/register', registrarUsuario);
router.post('/login', loginUsuario);
router.post('/logout', logout);
router.post('/recover-password', RecoverPassword);

// Rutas protegidas que requieren autenticación
router.post('/cambiar-contrasena', verificarToken, async (req, res) => {
    try {
        await cambiarContrasena(req, res);
    } catch (error) {
        console.error('Error en cambio de contraseña:', error);
        res.status(500).json({ 
            mensaje: 'Error al cambiar la contraseña',
            error: error.message 
        });
    }
});

export default router;
