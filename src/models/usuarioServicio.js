import { Model, DataTypes } from 'sequelize';
import  sequelize  from '../../config/db.js';
import User from './userModel.js';
import Servicio from './servicio.js';


class UsuarioService extends Model {}

UsuarioService.init({
  numero_cuenta: { type: DataTypes.STRING },
  estado: { type: DataTypes.STRING },
  creado_en: { type: DataTypes.DATE }
}, {
  sequelize,
  modelName: 'UsuarioService'
});

export default UsuarioService;
  
User.hasMany(UsuarioService, { foreignKey: 'usuario_id' });
UsuarioService.belongsTo(User, { foreignKey: 'usuario_id' });

// En UsuarioServicio.js:
UsuarioService.belongsTo(Servicio, { foreignKey: 'servicio_id' });
