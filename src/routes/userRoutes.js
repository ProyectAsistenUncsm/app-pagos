import { Router } from 'express';
import { registrarUsuario, loginUsuario, vistaPerfil } from '../controllers/userController.js';
import { verificarToken } from '../middleware/authMiddleware.js';

const router = Router();

// Ruta de registro
router.post('/register', registrarUsuario);

// Ruta de login
router.post('/login', loginUsuario);

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






