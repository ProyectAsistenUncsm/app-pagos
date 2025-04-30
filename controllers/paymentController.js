// controllers/pagoController.js
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

exports.realizarPago = async (req, res) => {
  const { monto, servicio_id, metodo_pago } = req.body;
  const { usuario_id } = req.user;  // Deberías tener un middleware para autenticar el usuario

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: monto * 100,  // Stripe usa centavos
      currency: 'usd',
      payment_method: metodo_pago,
      confirm: true,
    });

    // Registrar el pago en la base de datos
    // Aquí necesitas registrar el pago en la tabla 'pagos' como lo mencionaste.

    res.json({ mensaje: 'Pago realizado con éxito', paymentIntent });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al procesar el pago', error });
  }
};
