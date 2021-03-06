"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class offer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      offer.belongsTo(models.product, {
        foreignKey: "product_id",
      });
      offer.belongsTo(models.user, {
        foreignKey: "buyer_id",
      });
      offer.hasMany(models.notification, {
        foreignKey: "offer_id",
      });
    }
  }
  offer.init(
    {
      buyer_id: DataTypes.INTEGER,
      product_id: DataTypes.INTEGER,
      price_offer: DataTypes.INTEGER,
      status: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "offer",
    }
  );
  return offer;
};
