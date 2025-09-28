import User from './userModel.js';
import PayService from './PayService.js';
import UsuarioService from './UsuarioService.js';
import Factura from './Factura.js';
import Pago from './pago.js';

// Relaciones de User
User.hasMany(UsuarioService, { foreignKey: 'usuario_id' });
User.hasMany(Factura, { foreignKey: 'usuario_id' });
User.hasMany(Pago, { foreignKey: 'user_id' });

// Relaciones de PayService
PayService.hasMany(UsuarioService, { foreignKey: 'pay_service_id' });
PayService.hasMany(Factura, { foreignKey: 'pay_service_id' });
PayService.hasMany(Pago, { foreignKey: 'pay_service_id' });

// Relaciones de UsuarioService
UsuarioService.belongsTo(User, { foreignKey: 'usuario_id' });
UsuarioService.belongsTo(PayService, { foreignKey: 'pay_service_id' });

// Relaciones de Factura
Factura.belongsTo(User, { foreignKey: 'usuario_id' });
Factura.belongsTo(PayService, { foreignKey: 'pay_service_id' });

// Relaciones de Pago
Pago.belongsTo(User, { foreignKey: 'user_id' });
Pago.belongsTo(PayService, { foreignKey: 'pay_service_id' });

export {
    User,
    PayService,
    UsuarioService,
    Factura,
    Pago
}; 