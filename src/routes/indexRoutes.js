import { Router } from 'express';
const router = Router();

// Ruta principal
router.get('/', (req, res) => {
    if (req.user) {
        res.render('index', { usuario: req.user });
    } else {
        res.redirect('/auth/login');
    }
});

// Rutas protegidas (requieren autenticación)
router.get('/pagos', (req, res) => {
    if (!req.user) {
        return res.redirect('/auth/login');
    }
    res.render('pagos', { usuario: req.user });
});

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

router.get('/historial', (req, res) => {
    if (!req.user) {
        return res.redirect('/auth/login');
    }
    res.render('historial', { usuario: req.user });
});

router.get('/login', (req, res) => res.render('login'));
router.get('/login', (req, res) => res.render('auth/login'));
router.get('/register', (req, res) => res.render('auth/register'));
router.get('/vincular-service', (req, res) => res.render('auth/vincular-service'));
router.get('/recover', (req, res) => res.render('recover'));

export default router;