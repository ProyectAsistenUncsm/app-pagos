import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/db.js';

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
  }
}, {
  sequelize,
  modelName: 'User',
  tableName: 'usuarios',
  timestamps: false
});

export default User; // Export the class