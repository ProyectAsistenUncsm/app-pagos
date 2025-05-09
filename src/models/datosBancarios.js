const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class DatosBancarios extends Model {}

DatosBancarios.init({
  nombre_banco: { type: DataTypes.STRING },
  numero_cuenta: { type: DataTypes.STRING },
  tipo_cuenta: { type: DataTypes.STRING },
  tarjeta: { type: DataTypes.STRING },
  vencimiento: { type: DataTypes.DATE },
  cvv: { type: DataTypes.STRING },
  actualizado_en: { type: DataTypes.DATE }
}, {
  sequelize,
  modelName: 'DatosBancarios'
});

module.exports = DatosBancarios;
  