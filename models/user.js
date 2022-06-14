"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class user extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            user.hasMany(models.product, {
                foreignKey: "user_id",
            });
            user.hasMany(models.offer, {
                foreignKey: "buyer_id",
            });
        }
    }
    user.init({
        name: DataTypes.STRING,
        email: DataTypes.STRING,
        password: DataTypes.STRING,
        profile_pict: DataTypes.STRING,
        city: DataTypes.STRING,
        address: DataTypes.STRING,
        no_hp: DataTypes.STRING,
    }, {
        sequelize,
        modelName: "user",
    });
    return user;
};