'use strict';
module.exports = (sequelize, DataTypes) => {
  const DiscountTagProduct = sequelize.define('DiscountTagProduct', {
    id : {
      type : DataTypes.UUID,
      primaryKey : true,
      defaultValue : DataTypes.UUIDV4
    },
    discount_tag_id: DataTypes.UUID,
    product_id: DataTypes.UUID
  }, {});
  DiscountTagProduct.associate = function(models) {
    // associations can be defined here
    DiscountTagProduct.belongsTo(models.DiscountTag, {foreignKey : "discount_tag_id"});
    DiscountTagProduct.belongsTo(models.Product, {foreignKey : "product_id"});
  };
  return DiscountTagProduct;
};