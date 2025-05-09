// models/usuario.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class Usuario extends Model {}

Usuario.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING },
  correo: { type: DataTypes.STRING, unique: true },
  contrasena: { type: DataTypes.STRING },
  telefono: { type: DataTypes.STRING },
  direccion: { type: DataTypes.TEXT },
  fecha_registro: { type: DataTypes.DATE },
}, {
  sequelize,
  modelName: 'Usuario'
});

module.exports = Usuario;
