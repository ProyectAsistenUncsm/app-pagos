const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const { Pago } = require('../models');

exports.realizarPago = async (req, res) => {
  try {
    const { monto, servicio_id, metodo_pago } = req.body;
    const { id: usuario_id } = req.user;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: monto * 100,
      currency: 'usd',
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

    res.json({ mensaje: 'Pago realizado', pago });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
