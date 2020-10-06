'use strict';
module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    id : {
      type : DataTypes.UUID,
      primaryKey : true,
      defaultValue : DataTypes.UUIDV4
    },
    product_no : DataTypes.STRING,
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    price: DataTypes.INTEGER,
    qty: DataTypes.INTEGER,
    product_category_id: DataTypes.STRING,
    image_1: DataTypes.STRING,
    image_2: DataTypes.STRING,
    image_3: DataTypes.STRING,
    weight : DataTypes.INTEGER,
  }, {});
  Product.associate = function(models) {
    // associations can be defined here
    Product.hasMany(models.ProductCategory, {foreignKey : "product_id"});
    Product.hasMany(models.ProductFav, {foreignKey : "product_id"});
    Product.belongsToMany(models.Category, {foreignKey : "product_id", through : models.ProductCategory});
    Product.belongsToMany(models.ProductFav, {foreignKey : "product_id", through : models.ProductFav});
    Product.hasMany(models.OrderDetail, {foreignKey : "product_id"});
    
  };
  return Product;
};