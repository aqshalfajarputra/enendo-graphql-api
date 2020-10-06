'use strict';
module.exports = (sequelize, DataTypes) => {
  const ProductCategory = sequelize.define('ProductCategory', {
    id : {
      type : DataTypes.UUID,
      primaryKey : true,
      defaultValue : DataTypes.UUIDV4
    },
    category_id: DataTypes.UUID,
    product_id: DataTypes.UUID
  }, {});
  ProductCategory.associate = function(models) {
    // associations can be defined here
    ProductCategory.belongsTo(models.Product, {foreignKey : "product_id"});
    ProductCategory.belongsTo(models.Category, {foreignKey : "category_id"});
  };
  return ProductCategory;
};