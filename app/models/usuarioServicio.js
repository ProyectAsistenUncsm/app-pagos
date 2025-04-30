module.exports = (sequelize, DataTypes) => {
    return sequelize.define('UsuarioServicio', {
      numero_cuenta: DataTypes.STRING,
      estado: DataTypes.STRING,
      creado_en: DataTypes.DATE
    });
  };
  