"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class product_tag extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            product_tag.belongsTo(models.product, {
                foreignKey: "product_id",
            });
            product_tag.belongsTo(models.category, {
                foreignKey: "category_id",
            });
        }
    }
    product_tag.init({
        category_id: DataTypes.INTEGER,
        product_id: DataTypes.INTEGER,
    }, {
        sequelize,
        modelName: "product_tag",
    });
    return product_tag;
};