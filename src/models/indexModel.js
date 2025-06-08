import { sequelize } from '../../config/db.js';
import User from './userModel.js';
import PayService from './PayService.js';
import PayServicesData from './PayServicesData.js';
import UsuarioService from './UsuarioService.js';
import Factura from './Factura.js';
import Pago from './pago.js';

// Importar las asociaciones
import './associations.js';

export {
    sequelize,
    User,
    PayService,
    PayServicesData,
    UsuarioService,
    Factura,
    Pago
};
