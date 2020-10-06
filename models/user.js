'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id : {
      type : DataTypes.UUID,
      primaryKey : true,
      defaultValue : DataTypes.UUIDV4
    },
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING
  }, {});
  User.associate = function(models) {
    // associations can be defined here
    User.hasMany(models.Address, {foreignKey : "user_id"});
    User.hasMany(models.ProductFav, {foreignKey : "user_id"});
    User.hasMany(models.Event, {foreignKey : "user_id"});
    User.belongsToMany(models.Product, {foreignKey : "user_id", through : models.ProductFav});
    User.hasMany(models.Order, {foreignKey : "user_id"});
    User.hasMany(models.Payment, {foreignKey : "user_id"});
    
  };
  return User;
};