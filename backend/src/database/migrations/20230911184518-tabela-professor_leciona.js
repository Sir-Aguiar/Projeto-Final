"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("professorLeciona", {
      idLeciona: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      idProfessor: {
        type: Sequelize.INTEGER,
        references: {
          model: "usuarios",
          key: "idUsuario",
        },
        allowNull: false,
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      idDisciplina: {
        type: Sequelize.INTEGER,
        references: { model: "disciplinas", key: "idDisciplina" },
        allowNull: false,
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      idTurma: {
        type: Sequelize.INTEGER,
        references: { model: "turmas", key: "idTurma" },
        allowNull: false,
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
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
    await queryInterface.dropTable("professorLeciona");
  },
};

