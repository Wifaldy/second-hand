"use strict";

const { query } = require("express");

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
    await queryInterface.bulkInsert("offers", [
      {
        buyer_id: 2,
        product_id: 1,
        price_offer: 100,
        status: "pending",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        buyer_id: 1,
        product_id: 2,
        price_offer: 200,
        status: "pending",
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
    await queryInterface.bulkDelete("offers", null, {
      truncate: true,
      restartIdentity: true,
    });
  },
};
