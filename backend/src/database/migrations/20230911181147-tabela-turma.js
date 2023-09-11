"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("turmas", {
      idTurma: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      idEscola: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "escolas", key: "idEscola" },
        onDelete: "CASCADE",
      },
      idCurso: {
        type: Sequelize.INTEGER,
        references: { model: "cursos", key: "idCurso" },
        allowNull: false,
        onDelete: "CASCADE",
      },
      nome: { type: Sequelize.STRING(15), allowNull: false },
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
    await queryInterface.dropTable("turmas");
  },
};

