"use strict";
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("products", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            user_id: {
                type: Sequelize.INTEGER,
            },
            category_id: {
                type: Sequelize.INTEGER,
            },
            name: {
                type: Sequelize.STRING,
            },
            price: {
                type: Sequelize.INTEGER,
            },
            description: {
                type: Sequelize.STRING,
            },
            status: {
                type: Sequelize.STRING,
            },
            product_pict: {
                type: Sequelize.ARRAY(Sequelize.STRING),
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("products");
    },
};