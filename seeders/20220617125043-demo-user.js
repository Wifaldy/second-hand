"use strict";
const bcrypt = require("bcryptjs");

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
    const pass = await bcrypt.hash("123", 10);
    await queryInterface.bulkInsert("users", [
      {
        name: "Demo User",
        email: "demouser@gmail.com",
        password: pass,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Demo User 2",
        email: "demouser2@gmail.com",
        password: pass,
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
    await queryInterface.bulkDelete("users", null, {
      truncate: true,
      restartIdentity: true,
    });
  },
};
