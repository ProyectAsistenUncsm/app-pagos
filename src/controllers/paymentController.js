const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const { Pago, Servicio } = require('../models');
const { io } = require('../index.js');

export const realizarPago = async (req, res) => {
    try {
        const { monto, servicio_id, metodo_pago } = req.body;
        const { id: usuario_id } = req.user;

        // Obtener información del servicio
        const servicio = await Servicio.findByPk(servicio_id);
        if (!servicio) {
            throw new Error('Servicio no encontrado');
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount: monto * 100,
            currency: 'cor',
            payment_method: metodo_pago,
            confirm: true,
        });

        const pago = await Pago.create({
            usuario_id,
            servicio_id,
            monto,
            fecha_pago: new Date(),
            referencia: paymentIntent.id,
            metodo_pago: 'tarjeta',
            estado: 'completado',
        });

        // Emitir evento de pago exitoso
        io.emit('pagoRealizado', {
            usuario_id,
            servicio_id,
            servicio_nombre: servicio.nombre,
            monto,
            fecha: pago.fecha_pago
        });

        res.json({ mensaje: 'Pago realizado', pago });
    } catch (err) {
        // Emitir evento de pago fallido
        io.emit('pagoFallido', {
            usuario_id: req.user?.id,
            servicio_id: req.body?.servicio_id,
            mensaje: err.message
        });

        res.status(500).json({ error: err.message });
    }
};
