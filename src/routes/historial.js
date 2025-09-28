import express from 'express';
import { verificarToken } from '../middleware/authMiddleware.js';
import { Pago, PayService } from '../models/indexModel.js';

const router = express.Router();

// Obtener el historial de pagos del usuario autenticado
router.get('/personal', verificarToken, async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).render('error', {
                mensaje: 'Usuario no autenticado',
                usuario: null
            });
        }

        const historial = await Pago.findAll({
            where: { user_id: req.user.id },
            order: [['fecha_pago', 'DESC']],
            include: [{
                model: PayService,
                attributes: ['nombre']
            }]
        });
            
        res.render('historial_personal', { 
            historial,
            usuario: req.user,
            title: 'Historial de Pagos',
            activePage: 'historial'
        });
    } catch (error) {
        console.error('Error al obtener historial:', error);
        res.status(500).render('error', { 
            mensaje: 'Error al obtener el historial de pagos',
            usuario: req.user || null
        });
    }
});

export default router;
