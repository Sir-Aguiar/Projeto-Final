"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("chamadaAluno", {
      idChamada: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
          model: "chamadas",
          key: "idChamada",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      idAluno: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
          model: "alunos",
          key: "idAluno",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
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
    await queryInterface.dropTable("chamadaAluno");
  },
};

