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
    await queryInterface.bulkInsert("products", [
      {
        user_id: 1,
        name: "product 1",
        price: 100,
        description: "description 1",
        status: "available",
        product_pict: ["pict 1", "pict 2"],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        user_id: 2,
        name: "product 2",
        price: 200,
        description: "description 2",
        status: "available",
        product_pict: ["pict 2", "pict 3"],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        user_id: 1,
        name: "product 3",
        price: 300,
        description: "description 3",
        status: "sold",
        product_pict: ["pict 2", "pict 3"],
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
