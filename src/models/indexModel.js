const sequelize = require('../config/db');
const { DataTypes } = require('sequelize');

const Usuario = require('./userModel');
const DatosBancarios = require('./datosBancarios');
const Servicio = require('./servicio');
const UsuarioServicio = require('./usuarioServicio');
const Pago = require('./pago');

Usuario.hasMany(DatosBancarios);
DatosBancarios.belongsTo(Usuario);

Usuario.belongsToMany(Servicio, { through: UsuarioServicio });
Servicio.belongsToMany(Usuario, { through: UsuarioServicio });

Usuario.hasMany(Pago);
Pago.belongsTo(Usuario);
Servicio.hasMany(Pago);
Pago.belongsTo(Servicio);

module.exports = {
  sequelize,
  Usuario,
  DatosBancarios,
  Servicio,
  UsuarioServicio,
  Pago,
};
