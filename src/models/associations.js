import User from './userModel.js';
import PayService from './PayService.js';
import PayServicesData from './PayServicesData.js';
import UsuarioService from './UsuarioService.js';
import Factura from './Factura.js';
import Pago from './pago.js';

// Relaciones de User
User.hasMany(UsuarioService, { foreignKey: 'usuario_id' });
User.hasMany(Factura, { foreignKey: 'usuario_id' });
User.hasMany(Pago, { foreignKey: 'usuario_id' });

// Relaciones de PayService
PayService.hasMany(UsuarioService, { foreignKey: 'pay_service_id' });
PayService.hasMany(Factura, { foreignKey: 'pay_service_id' });
PayService.hasMany(Pago, { foreignKey: 'pay_service_id' });
PayService.hasOne(PayServicesData, { foreignKey: 'id', sourceKey: 'id', as: 'data' });

// Relaciones de PayServicesData
PayServicesData.belongsTo(PayService, { foreignKey: 'id', targetKey: 'id' });

// Relaciones de UsuarioService
UsuarioService.belongsTo(User, { foreignKey: 'usuario_id' });
UsuarioService.belongsTo(PayService, { foreignKey: 'pay_service_id' });

// Relaciones de Factura
Factura.belongsTo(User, { foreignKey: 'usuario_id' });
Factura.belongsTo(PayService, { foreignKey: 'pay_service_id' });
Factura.hasMany(Pago, { foreignKey: 'factura_id' });

// Relaciones de Pago
Pago.belongsTo(User, { foreignKey: 'usuario_id' });
Pago.belongsTo(Factura, { foreignKey: 'factura_id' });
Pago.belongsTo(PayService, { foreignKey: 'pay_service_id' });

export {
    User,
    PayService,
    PayServicesData,
    UsuarioService,
    Factura,
    Pago
}; 