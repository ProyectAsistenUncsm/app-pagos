import sequelize from '../../config/db.js';

import User from '../userModel.js';
import bank_data from '../datosBancarios.js';
import Servicio from '../servicio.js';
import UsuarioService from '../usuarioServicio.js';
import Pay from '../pago.js';

User.hasMany(bank_data);
bank_data.belongsTo(User);

User.belongsToMany(Servicio, { through: UsuarioService });
Servicio.belongsToMany(User, { through: UsuarioService });

User.hasMany(Pay);
Pay.belongsTo(User);

Servicio.hasMany(Pay);
Pay.belongsTo(Servicio);

export {
  sequelize,
  User,
  bank_data,
  Servicio,
  UsuarioService,
  Pay,
};
