const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class Servicio extends Model {}

Servicio.init({
  nombre: { type: DataTypes.STRING },
  descripcion: { type: DataTypes.TEXT }
}, {
  sequelize,
  modelName: 'Servicio'
});

module.exports = Servicio;
  