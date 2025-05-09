import { Router } from 'express';
const router = Router()

router.get('/', (req, res) => res.render('index'));
router.get('/pagos', (req, res) => res.render('pagos'));
router.get('/perfil', (req, res) => res.render('perfil'));
router.get('/dashboard', (req, res) => res.render('dashboard'));
router.get('/register', (req, res) => res.render('register'));
router.get('/login', (req, res) => res.render('login'));
router.get('/vincular-service', (req, res) => res.render('vincular-service'));


export default router