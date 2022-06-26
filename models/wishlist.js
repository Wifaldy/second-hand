"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class wishlist extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      wishlist.belongsTo(models.user, {
        foreignKey: "user_id",
      });
      wishlist.belongsTo(models.product, {
        foreignKey: "product_id",
      });
    }
  }
  wishlist.init(
    {
      user_id: DataTypes.INTEGER,
      product_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "wishlist",
    }
  );
  return wishlist;
};
