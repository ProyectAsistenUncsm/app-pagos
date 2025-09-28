import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/db.js';

class Pago extends Model {}

Pago.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    pay_service_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    monto: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    fecha_pago: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    referencia: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    metodo_pago: {
        type: DataTypes.STRING(30),
        allowNull: false
    },
    estado: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: 'completado'
    }
}, {
    sequelize,
    modelName: 'Pago',
    tableName: 'Pays',
    timestamps: false
});

export default Pago;