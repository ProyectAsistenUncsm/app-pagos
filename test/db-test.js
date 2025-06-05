import { sequelize } from '../config/db.js';
import Usuario from '../models/Usuario.js';

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Conexión a la base de datos establecida correctamente.');
    
    // Sincronizar el modelo con la base de datos
    await Usuario.sync();
    console.log('Modelo Usuario sincronizado correctamente.');
    
    // Probar una consulta simple
    const usuarios = await Usuario.findAll();
    console.log('Número de usuarios en la base de datos:', usuarios.length);
    
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error);
  } finally {
    await sequelize.close();
  }
}

testConnection(); 