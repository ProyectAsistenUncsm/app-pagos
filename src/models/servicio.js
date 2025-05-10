// models/servicio.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class Servicio extends Model {}

Servicio.init({
  nombre: { type: DataTypes.STRING, allowNull: false },
  descripcion: { type: DataTypes.TEXT }
}, {
  sequelize,
  modelName: 'Servicio'
});

module.exports = Servicio;

  