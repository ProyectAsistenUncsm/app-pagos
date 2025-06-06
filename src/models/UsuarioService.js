import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/db.js';

class UsuarioService extends Model {}

UsuarioService.init({
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
    numero_cuenta: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    estado: {
        type: DataTypes.ENUM('pendiente', 'pagado', 'vencido'),
        defaultValue: 'pendiente'
    },
    monto: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    fecha_vencimiento: {
        type: DataTypes.DATE,
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE
    },
    updatedAt: {
        type: DataTypes.DATE
    }
}, {
    sequelize,
    modelName: 'UsuarioService',
    tableName: 'usuario_services',
    timestamps: true
});

export default UsuarioService; 