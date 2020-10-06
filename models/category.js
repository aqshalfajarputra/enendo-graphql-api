'use strict';
module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define('Category', {
    id : {
      type : DataTypes.UUID,
      primaryKey : true,
      defaultValue : DataTypes.UUIDV4
    },
    name: DataTypes.STRING
  }, {});
  Category.associate = function(models) {
    // associations can be defined here
    Category.hasMany(models.ProductCategory, {foreignKey : "product_id"});
    Category.belongsToMany(models.Product, {foreignKey : "product_id", through : models.ProductCategory});
  };
  return Category;
};