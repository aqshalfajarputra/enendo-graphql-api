'use strict';
module.exports = (sequelize, DataTypes) => {
  const Address = sequelize.define('Address', {
    id : {
      type : DataTypes.UUID,
      primaryKey : true,
      defaultValue : DataTypes.UUIDV4
    },
    name: DataTypes.STRING,
    address: DataTypes.STRING,
    phone: DataTypes.STRING,
    user_id: DataTypes.UUID,
    city_id : DataTypes.STRING,
    city_name : DataTypes.STRING,
    province_id : DataTypes.STRING,
    province : DataTypes.STRING,
  }, {});
  Address.associate = function(models) {
    // associations can be defined here
    Address.belongsTo(models.User, {foreignKey : "user_id"});
    Address.hasMany(models.Shipping, {foreignKey : "address_id"});
  };
  return Address;
};