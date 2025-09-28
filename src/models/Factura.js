import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/db.js';
import PayService from './PayService.js';

class Factura extends Model {}

Factura.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    pay_service_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'pay_services',
            key: 'id'
        }
    },
    usuario_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'usuarios',
            key: 'id'
        }
    },
    monto: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    fecha_emision: {
        type: DataTypes.DATE,
        allowNull: false
    },
    fecha_vencimiento: {
        type: DataTypes.DATE,
        allowNull: false
    },
    estado: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'pendiente'
    },
    createdAt: {
        type: DataTypes.DATE
    },
    updatedAt: {
        type: DataTypes.DATE
    }
}, {
    sequelize,
    modelName: 'Factura',
    tableName: 'facturas',
    timestamps: true
});

// Relaciones
Factura.belongsTo(PayService, {
    foreignKey: 'pay_service_id',
    as: 'PayService'
});

export default Factura; 