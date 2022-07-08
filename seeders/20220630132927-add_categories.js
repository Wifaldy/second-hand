'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    const categoriesData = [
      {
        name: 'Hobi',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Kendaraan',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Baju',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Elektronik',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Kesehatan',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
    await queryInterface.bulkInsert("categories", categoriesData);
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete("categories", null, {
      truncate: true,
      restartIdentity: true,
    });
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
