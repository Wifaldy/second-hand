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
        const password = await bcrypt.hash("123", 12);
        await queryInterface.bulkInsert("users", [{
            id: 1,
            name: "Andri Wifaldy",
            email: "andriwifaldy@gmail.com",
            password: password,
            profile_pict: null,
            city: null,
            address: null,
            no_hp: null,
            createdAt: new Date(),
            updatedAt: new Date(),
        }, ]);
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