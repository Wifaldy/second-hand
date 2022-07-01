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
    await queryInterface.bulkInsert("product_tags", [
      {
        category_id: 1,
        product_id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        category_id: 2,
        product_id: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        category_id: 3,
        product_id: 1,
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
    await queryInterface.bulkDelete("product_tags", null, {
      truncate: true,
      restartIdentity: true,
    });
  },
};
