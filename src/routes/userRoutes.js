import { Router } from 'express';
import { vistaPerfil, actualizarImagenPerfil } from '../controllers/userController.js';
import { logout } from '../controllers/authController.js';
import { verificarToken } from '../middleware/authMiddleware.js';

const router = Router();

// Ruta para cerrar sesión
router.post('/auth/logout', logout);

// Ruta para actualizar imagen de perfil
router.post('/actualizar-imagen', verificarToken, actualizarImagenPerfil);

// Ruta para obtener perfil del usuario (requiere autenticación)
router.get('/vista-perfil', verificarToken, vistaPerfil);

router.get('/perfil', verificarToken, async (req, res) => {
    try {
      const usuario = await Usuario.findByPk(req.usuario.id, {
        include: [{ model: UsuarioServicio, include: ['servicio'] }]
      });
  
      if (!usuario) return res.status(404).send('Usuario no encontrado');
  
      res.render('perfil', { usuario }); // Asegúrate de tener perfil.ejs
    } catch (err) {
      res.status(500).send('Error al cargar perfil');
    }
  });
  
export default router;






