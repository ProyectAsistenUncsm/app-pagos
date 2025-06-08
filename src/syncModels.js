import { sequelize } from '../config/db.js';
import User from './models/userModel.js';
import bank_data from './models/datosBancarios.js';
import PayService from './models/PayService.js';
import UsuarioService from './models/UsuarioService.js';
import Pago from './models/pago.js';

async function syncModels() {
  try {
    // Sincronizar todos los modelos
    await sequelize.sync({ force: false }); // force: false para no eliminar datos existentes
    console.log('Modelos sincronizados correctamente');
  } catch (error) {
    console.error('Error al sincronizar modelos:', error);
  } finally {
    await sequelize.close();
  }
}

syncModels(); 