"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("chamadas", {
      idChamada: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      idAula: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "aulas",
          key: "idAula",
        },
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("chamadas");
  },
};

