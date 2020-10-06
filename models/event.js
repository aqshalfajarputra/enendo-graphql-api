'use strict';
module.exports = (sequelize, DataTypes) => {
  const Event = sequelize.define('Event', {
    id : {
      type : DataTypes.UUID,
      primaryKey : true,
      defaultValue : DataTypes.UUIDV4
    },
    product_id: DataTypes.UUID,
    status: DataTypes.STRING,
    user_id: DataTypes.UUID,
    qty: DataTypes.INTEGER
  }, {});
  Event.associate = function(models) {
    // associations can be defined here
    Event.belongsTo(models.Product, {foreignKey : "product_id"});
    Event.belongsTo(models.User, {foreignKey : "user_id"});
  };
  return Event;
};