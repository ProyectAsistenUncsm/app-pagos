import express from 'express';
import { registrarUsuario, loginUsuario, RecoverPassword } from '../controllers/authController.js';
import { vistaPerfil } from '../controllers/userController.js';

const router = express.Router();

// Rutas de autenticación
router.get('/register', (req, res) => res.render('register'));
router.get('/login', (req, res) => res.render('login'));
router.get('/recover', (req, res) => res.render('recover'));

router.get('/profile', vistaPerfil);

// Endpoints de la API
router.post('/register', registrarUsuario);
router.post('/login', loginUsuario);


router.post('/recover', RecoverPassword);

export default router;
