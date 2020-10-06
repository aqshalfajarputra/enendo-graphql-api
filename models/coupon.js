'use strict';
module.exports = (sequelize, DataTypes) => {
  const Coupon = sequelize.define('Coupon', {
    coupon_code: DataTypes.STRING,
    percentage: DataTypes.FLOAT,
    type: DataTypes.INTEGER,
    min_amount: DataTypes.FLOAT,
    max_amount: DataTypes.FLOAT,
    description: DataTypes.TEXT
  }, {});
  Coupon.associate = function(models) {
    // associations can be defined here
    Coupon.hasMany(models.Order, {foreignKey : "coupon_id"});
    
  };
  return Coupon;
};