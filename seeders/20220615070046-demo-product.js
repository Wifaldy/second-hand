"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        /**
         * Add seed commands here.
         *
         * Example:
         * await queryInterface.bulkInsert('People', [{
         *   name: 'John Doe',
         *   isBetaMember: false
         * }], {});
         */
        await queryInterface.bulkInsert("products", [{
                user_id: 1,
                category_id: 1,
                name: "Product 1",
                price: 100,
                description: "Product 1",
                status: "active",
                product_pict: ["pict 1", "pict 2"],
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                user_id: 2,
                category_id: 1,
                name: "Product 2",
                price: 200,
                description: "Product 2",
                status: "active",
                product_pict: ["pict 1", "pict 2"],
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]);
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
        await queryInterface.bulkDelete("products", null, {
            truncate: true,
            restartIdentity: true,
        });
    },
};