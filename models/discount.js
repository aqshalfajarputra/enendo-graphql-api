'use strict';
module.exports = (sequelize, DataTypes) => {
  const Discount = sequelize.define('Discount', {
    id : {
      type : DataTypes.UUID,
      primaryKey : true,
      defaultValue : DataTypes.UUIDV4
    },
    name: DataTypes.STRING,
    percentage: DataTypes.INTEGER,
    description: DataTypes.TEXT,
    discount_tag_id: DataTypes.STRING,
    discount_start: DataTypes.DATE,
    discount_end: DataTypes.DATE
    
  }, {});
  Discount.associate = function(models) {
    // associations can be defined here
    Discount.belongsTo(models.DiscountTag, {foreignKey : "discount_tag_id"});
  };
  return Discount;
};