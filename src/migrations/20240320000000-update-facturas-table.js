import { sequelize } from '../../config/db.js';

export const up = async () => {
    try {
        await sequelize.query(`
            ALTER TABLE facturas 
            CHANGE COLUMN user_id usuario_id INT NOT NULL;
        `);
        console.log('Migración completada: Columna user_id renombrada a usuario_id');
    } catch (error) {
        console.error('Error en la migración:', error);
        throw error;
    }
};

export const down = async () => {
    try {
        await sequelize.query(`
            ALTER TABLE facturas 
            CHANGE COLUMN usuario_id user_id INT NOT NULL;
        `);
        console.log('Migración revertida: Columna usuario_id renombrada a user_id');
    } catch (error) {
        console.error('Error al revertir la migración:', error);
        throw error;
    }
}; 