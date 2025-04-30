module.exports = (sequelize, DataTypes) => {
    return sequelize.define('DatosBancarios', {
      nombre_banco: DataTypes.STRING,
      numero_cuenta: DataTypes.STRING,
      tipo_cuenta: DataTypes.STRING,
      tarjeta: DataTypes.STRING,
      vencimiento: DataTypes.DATE,
      cvv: DataTypes.STRING,
      actualizado_en: DataTypes.DATE
    });
  };
  