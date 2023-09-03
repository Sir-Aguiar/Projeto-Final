"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("alunoChamada", {
      idRelacao: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      idAluno: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "alunos",
          key: "idAluno",
        },
      },
      idChamada: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "chamadas",
          key: "idChamada",
        },
      },
      situacao: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
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
    await queryInterface.dropTable("alunoChamada");
  },
};

