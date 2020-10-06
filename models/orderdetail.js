'use strict';
module.exports = (sequelize, DataTypes) => {
  const OrderDetail = sequelize.define('OrderDetail', {
    id : {
      type : DataTypes.UUID,
      primaryKey : true,
      defaultValue : DataTypes.UUIDV4
    },
    order_id: DataTypes.UUID,
    product_id: DataTypes.UUID,
    qty: DataTypes.INTEGER
  }, {});
  OrderDetail.associate = function(models) {
    // associations can be defined here
    OrderDetail.belongsTo(models.Order, {foreignKey : "order_id"});
    OrderDetail.belongsTo(models.Product,{foreignKey : "product_id"})
  };
  return OrderDetail;
};