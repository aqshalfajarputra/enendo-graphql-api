'use strict';
module.exports = (sequelize, DataTypes) => {
  const DiscountTag = sequelize.define('DiscountTag', {
    id : {
      type : DataTypes.UUID,
      primaryKey : true,
      defaultValue : DataTypes.UUIDV4
    },
    name: DataTypes.STRING
  }, {});
  DiscountTag.associate = function(models) {
    // associations can be defined here
    DiscountTag.hasMany(models.DiscountTagProduct, {foreignKey : "discount_tag_id"});
    DiscountTag.hasMany(models.Discount, {foreignKey : "discount_tag_id"});
  };
  return DiscountTag;
};