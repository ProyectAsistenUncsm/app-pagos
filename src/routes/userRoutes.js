import express from 'express';
import { 
    vistaPerfil, 
    actualizarImagenPerfil, 
    actualizarPerfil, 
    cambiarContrasena,
    mostrarPerfil,
    vincularServicio,
    confirmarVinculacion,
    crearFactura,
    confirmarFactura
} from '../controllers/userController.js';
import { logout } from '../controllers/authController.js';
import { verificarToken } from '../middleware/authMiddleware.js';


const router = express.Router();

// Ruta para cerrar sesión
router.post('/auth/logout', logout);

// Ruta para actualizar imagen de perfil
router.post('/actualizar-imagen', verificarToken, actualizarImagenPerfil);

// Ruta para obtener perfil del usuario (requiere autenticación)
router.get('/vista-perfil', verificarToken, vistaPerfil);

router.get('/perfil', verificarToken, mostrarPerfil);
router.post('/actualizar-perfil', verificarToken, actualizarPerfil);
router.post('/cambiar-contrasena', verificarToken, cambiarContrasena);
router.post('/vincular-servicio', verificarToken, vincularServicio);
router.post('/confirmar-vinculacion', verificarToken, confirmarVinculacion);

// Rutas para facturas
router.post('/crear-factura', verificarToken, crearFactura);
router.post('/confirmar-factura', verificarToken, confirmarFactura);

export default router;






