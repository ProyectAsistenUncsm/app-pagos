const sequelize = require('../config/db');
const { DataTypes } = require('sequelize');

const Usuario = require('./usuario')(sequelize, DataTypes);
const DatosBancarios = require('./datosBancarios')(sequelize, DataTypes);
const Servicio = require('./servicio')(sequelize, DataTypes);
const UsuarioServicio = require('./usuarioServicio')(sequelize, DataTypes);
const Pago = require('./pago')(sequelize, DataTypes);

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
