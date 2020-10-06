'use strict';
module.exports = (sequelize, DataTypes) => {
  const ProductFav = sequelize.define('ProductFav', {
    id : {
      type : DataTypes.UUID,
      primaryKey : true,
      defaultValue : DataTypes.UUIDV4
    },
    user_id: DataTypes.UUID,
    product_id: DataTypes.UUID
  }, {});
  ProductFav.associate = function(models) {
    // associations can be defined here
    ProductFav.belongsTo(models.Product, {foreignKey : "product_id"});
    ProductFav.belongsTo(models.User, {foreignKey : "user_id"});
  };
  return ProductFav;
};