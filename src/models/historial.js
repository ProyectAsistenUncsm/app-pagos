const mongoose = require('mongoose');

const historialSchema = new mongoose.Schema({
  usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  metodoPago: { type: String, required: true },
  monto: { type: Number, required: true },
  fechaPago: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Historial', historialSchema);
