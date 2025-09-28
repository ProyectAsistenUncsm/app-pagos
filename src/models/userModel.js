import { Model, DataTypes } from 'sequelize';
import  { sequelize }  from '../../config/db.js';
import UsuarioService from './UsuarioService.js';
import Factura from './Factura.js';
import Pago from './pago.js';

class User extends Model {} // Uppercase 'U'

User.init({
  id: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true 
  },
  nombre: { 
    type: DataTypes.STRING(100),
    allowNull: false 
  },
  correo: { 
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  contrasena: { 
    type: DataTypes.STRING(255),
    allowNull: false 
  },
  telefono: { 
    type: DataTypes.STRING(15),
    allowNull: true 
  },
  cedula: { 
    type: DataTypes.TEXT,
    allowNull: true
  },
  fecha_registro: { 
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW 
  },
  image_profile: { 
    type: DataTypes.BLOB('long'),
    allowNull: true,
    field: 'Profile_Picture'
  },
  rol_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 2, // Por defecto es Usuario (2)
    references: {
      model: 'roles',
      key: 'id'
    }
  }
}, {
  sequelize,
  modelName: 'User',
  tableName: 'usuarios',
  timestamps: false
});

// Relaciones de User
User.hasMany(UsuarioService, { foreignKey: 'user_id' });
User.hasMany(Factura, { foreignKey: 'usuario_id' });
User.hasMany(Pago, { foreignKey: 'user_id' });

export default User; // Export the class