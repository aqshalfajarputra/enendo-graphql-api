'use strict';
module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    id : {
      type : DataTypes.UUID,
      primaryKey : true,
      defaultValue : DataTypes.UUIDV4
    },
    order_no: DataTypes.STRING,
    user_id: DataTypes.UUID,
    shipping_id: DataTypes.UUID,
    payment_id: DataTypes.UUID,
    coupon_id: DataTypes.UUID,
    status: DataTypes.STRING,
    amount: DataTypes.FLOAT,
    total_amount: DataTypes.FLOAT,
    disc_amount : DataTypes.FLOAT
  }, {});
  Order.associate = function(models) {
    // associations can be defined here
    Order.hasMany(models.OrderDetail, {foreignKey : "order_id"});
    Order.hasOne(models.Shipping, {foreignKey : "order_id"});
    Order.belongsTo(models.User, {foreignKey : "user_id"});
    Order.belongsTo(models.Payment, {foreignKey : "payment_id"});
    Order.belongsTo(models.Coupon, {foreignKey : "coupon_id"});
    
    
  };
  return Order;
};