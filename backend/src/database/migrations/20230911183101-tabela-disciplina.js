"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("disciplinas", {
      idDisciplina: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      idEscola: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "escolas", key: "idEscola" },
        onDelete: "CASCADE",
      },
      nome: {
        type: Sequelize.STRING(50),
        allowNull: false,
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
    await queryInterface.dropTable("disciplinas");
  },
};

