'use strict';
module.exports = (sequelize, DataTypes) => {
  const UniqueNumber = sequelize.define('UniqueNumber', {
    id : {
      type : DataTypes.INTEGER,
      primaryKey : true
    },
    char: DataTypes.STRING,
    value: DataTypes.INTEGER
    
  }, {});
  UniqueNumber.associate = function(models) {
    // associations can be defined here
  };
  return UniqueNumber;
};