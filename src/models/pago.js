import { Model, DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';

class Pay extends Model {}

Pay.init({
  monto: { type: DataTypes.DECIMAL(10, 2) },
  fecha_pago: { type: DataTypes.DATE },
  referencia: { type: DataTypes.STRING },
  metodo_pago: { type: DataTypes.STRING },
  estado: { type: DataTypes.STRING }
}, {
  sequelize,
  modelName: 'Pay'
});

export default Pay;
  