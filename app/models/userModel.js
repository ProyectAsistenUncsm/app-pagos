// models/usuario.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Usuario = sequelize.define('Usuario', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING },
  correo: { type: DataTypes.STRING, unique: true },
  contrasena: { type: DataTypes.STRING },
  telefono: { type: DataTypes.STRING },
  direccion: { type: DataTypes.TEXT },
  fecha_registro: { type: DataTypes.DATE },
});

module.exports = Usuario;
