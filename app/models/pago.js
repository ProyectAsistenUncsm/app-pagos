module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Pago', {
      monto: DataTypes.DECIMAL(10, 2),
      fecha_pago: DataTypes.DATE,
      referencia: DataTypes.STRING,
      metodo_pago: DataTypes.STRING,
      estado: DataTypes.STRING
    });
  };
  