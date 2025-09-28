import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/db.js';

class bank_data extends Model {}

bank_data.init({
  nombre_banco: { type: DataTypes.STRING },
  numero_cuenta: { type: DataTypes.STRING },
  tipo_cuenta: { type: DataTypes.STRING },
  tarjeta: { type: DataTypes.STRING },
  vencimiento: { type: DataTypes.DATE },
  cvv: { type: DataTypes.STRING },
  actualizado_en: { type: DataTypes.DATE }
}, {
  sequelize,
  modelName: 'bank_data'
});

export default bank_data;
  