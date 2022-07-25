"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class notification extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      notification.belongsTo(models.user, {
        foreignKey: "user_id",
      });
      notification.belongsTo(models.product, {
        foreignKey: "product_id",
      });
      notification.belongsTo(models.offer, {
        foreignKey: "offer_id",
      });
    }
  }
  notification.init(
    {
      user_id: DataTypes.INTEGER,
      product_id: DataTypes.INTEGER,
      offer_id: DataTypes.INTEGER,
      title: DataTypes.STRING,
      status: DataTypes.STRING,
      description: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "notification",
    }
  );
  return notification;
};
