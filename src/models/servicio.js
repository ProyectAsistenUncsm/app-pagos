// models/service.js
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/db.js';

class Servicio extends Model {}

service.init({
  nombre: { type: DataTypes.STRING, allowNull: false },
  descripcion: { type: DataTypes.TEXT }
}, {
  sequelize,
  modelName: 'Servicio'
});

export default Servicio;

  