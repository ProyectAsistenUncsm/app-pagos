import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/db.js';

class PayService extends Model {}

PayService.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    descripcion: {
        type: DataTypes.TEXT
    },
    createdAt: {
        type: DataTypes.DATE
    },
    updatedAt: {
        type: DataTypes.DATE
    }
}, {
    sequelize,
    modelName: 'PayService',
    tableName: 'pay_services',
    timestamps: true
});

export default PayService; 