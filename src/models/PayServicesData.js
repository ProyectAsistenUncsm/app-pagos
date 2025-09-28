import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/db.js';

class PayServicesData extends Model {}

PayServicesData.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
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
    modelName: 'PayServicesData',
    tableName: 'pay_services_data',
    timestamps: true
});

export default PayServicesData; 