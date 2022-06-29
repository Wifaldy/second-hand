"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      product.hasMany(models.offer, {
        foreignKey: "product_id",
      });
      product.hasMany(models.product_tag, {
        foreignKey: "product_id",
      });
      product.belongsTo(models.user, {
        foreignKey: "user_id",
      });
      product.hasMany(models.wishlist, {
        foreignKey: "product_id",
      });
      product.hasMany(models.notification, {
        foreignKey: "product_id",
      });
    }
  }
  product.init(
    {
      user_id: DataTypes.INTEGER,
      name: DataTypes.STRING,
      price: DataTypes.INTEGER,
      description: DataTypes.STRING,
      status: DataTypes.STRING,
      product_pict: DataTypes.ARRAY(DataTypes.STRING),
    },
    {
      sequelize,
      modelName: "product",
    }
  );
  return product;
};
