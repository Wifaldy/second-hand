"use strict";

const getAllCityData = require("../services/city_data.service");

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      let cityData = await getAllCityData();
      cityData = cityData.map((city) => ({
        name: city.nama,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));
      await queryInterface.bulkInsert("cities", cityData);
    } catch (error) {
      throw new Error(error);
    }

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

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("cities", null, {
      truncate: true,
      restartIdentity: true,
    });
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
