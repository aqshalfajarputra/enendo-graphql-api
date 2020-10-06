'use strict';
module.exports = (sequelize, DataTypes) => {
  const Shipping = sequelize.define('Shipping', {
    id : {
      type : DataTypes.UUID,
      primaryKey : true,
      defaultValue : DataTypes.UUIDV4
    },
    ship_no: DataTypes.STRING,
    order_id: DataTypes.STRING                              ,
    address_id: DataTypes.UUID,
    ship_charge: DataTypes.FLOAT,
    discount: DataTypes.FLOAT,
    total_amount: DataTypes.FLOAT,
    status: DataTypes.STRING,
    total_weight : DataTypes.FLOAT,
    ship_courier : DataTypes.STRING,
    ship_service : DataTypes.STRING,
  }, {});
  Shipping.associate = function(models) {
    // associations can be defined here
    Shipping.belongsTo(models.Order, {foreignKey : "order_id"});
    Shipping.belongsTo(models.Address, {foreignKey : "address_id"});
  };
  return Shipping;
};