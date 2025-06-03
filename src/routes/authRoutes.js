import express from 'express';
import { register, login } from '../controllers/authController.js';

const router = express.Router();

router.get('/register', (req, res) => res.render('register'));
router.get('/login', (req, res) => res.render('login'));

router.post('/register', register);
router.post('/login', login);

router.get('/vincular-service', (req, res) => res.render('vincular-service'));
router.post('/vincular-service', vincularService);

router.post('/recover', (req, res) => res.render('reconver'));
router.post('/recover', recover);

export default router;
