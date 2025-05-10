const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verificarToken } = require('../middleware/authMiddleware');

// Ruta de registro
router.post('/register', userController.registrarUsuario);

// Ruta de login
router.post('/login', userController.loginUsuario);

// Ruta para obtener perfil del usuario (requiere autenticación)
router.get('/vista-perfil', verificarToken, userController.vistaPerfil);

module.exports = router;






