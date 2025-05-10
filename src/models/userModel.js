import { Model, DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';

class User extends Model {} // Uppercase 'U'

User.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING },
  correo: { type: DataTypes.STRING, unique: true },
  contrasena: { type: DataTypes.STRING },
  telefono: { type: DataTypes.STRING },
  direccion: { type: DataTypes.TEXT },
  fecha_registro: { type: DataTypes.DATE },
}, {
  sequelize,
  modelName: 'User' // Uppercase 'U' for model name
});

export default User; // Export the class