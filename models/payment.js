'use strict';
module.exports = (sequelize, DataTypes) => {
  const Payment = sequelize.define('Payment', {
    id : {
      type : DataTypes.UUID,
      primaryKey : true,
      defaultValue : DataTypes.UUIDV4
    },
    payment_no: DataTypes.STRING,
    status: DataTypes.STRING,
    user_id: DataTypes.UUID,
    order_id : DataTypes.UUID,
    total_amount : DataTypes.STRING,
    payment_type : DataTypes.STRING,
    payment_vendor : DataTypes.STRING,
    payment_channel : DataTypes.INTEGER,
    transaction_id : DataTypes.STRING,

  }, {});
  Payment.associate = function(models) {
    // associations can be defined here
    Payment.belongsTo(models.User, {foreignKey : "user_id"});
  };
  return Payment;
};