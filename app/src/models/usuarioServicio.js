const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class UsuarioServicio extends Model {}

UsuarioServicio.init({
  numero_cuenta: { type: DataTypes.STRING },
  estado: { type: DataTypes.STRING },
  creado_en: { type: DataTypes.DATE }
}, {
  sequelize,
  modelName: 'UsuarioServicio'
});

module.exports = UsuarioServicio;
  