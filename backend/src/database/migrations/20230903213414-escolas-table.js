"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("escolas", {
      idEscola: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      idProfessor: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "professores",
          key: "idProfessor",
        },
      },
      nome: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },
      EF1: { type: Sequelize.STRING(3), defaultValue: "EF1" },
      EF2: { type: Sequelize.STRING(3), defaultValue: "EF2" },
      EF3: { type: Sequelize.STRING(3), defaultValue: "EF3" },
      EF4: { type: Sequelize.STRING(3), defaultValue: "EF4" },
      EF5: { type: Sequelize.STRING(3), defaultValue: "EF5" },
      EF6: { type: Sequelize.STRING(3), defaultValue: "EF6" },
      EF7: { type: Sequelize.STRING(3), defaultValue: "EF7" },
      EF8: { type: Sequelize.STRING(3), defaultValue: "EF8" },
      EF9: { type: Sequelize.STRING(3), defaultValue: "EF9" },
      EM1: { type: Sequelize.STRING(3), defaultValue: "EM1" },
      EM2: { type: Sequelize.STRING(3), defaultValue: "EM2" },
      EM3: { type: Sequelize.STRING(3), defaultValue: "EM3" },
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
    await queryInterface.dropTable("escolas");
  },
};

