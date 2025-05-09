const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class Pago extends Model {}

Pago.init({
  monto: { type: DataTypes.DECIMAL(10, 2) },
  fecha_pago: { type: DataTypes.DATE },
  referencia: { type: DataTypes.STRING },
  metodo_pago: { type: DataTypes.STRING },
  estado: { type: DataTypes.STRING }
}, {
  sequelize,
  modelName: 'Pago'
});

module.exports = Pago;
  