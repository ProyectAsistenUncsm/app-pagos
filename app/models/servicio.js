module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Servicio', {
      nombre: DataTypes.STRING,
      descripcion: DataTypes.TEXT
    });
  };
  