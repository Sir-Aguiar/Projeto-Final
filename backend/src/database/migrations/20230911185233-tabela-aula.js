"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("aulas", {
      idAula: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      idTurma: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "turmas",
          key: "idTurma",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      idDisciplina: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "disciplinas",
          key: "idDisciplina",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      idProfessor: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "usuarios",
          key: "idUsuario",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      anotacao: {
        type: Sequelize.TEXT,
        allowNull: true,
        defaultValue: null,
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
    await queryInterface.dropTable("aulas");
  },
};

