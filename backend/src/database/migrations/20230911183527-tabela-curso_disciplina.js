"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("cursoDisciplina", {
      idCurso: {
        primaryKey: true,
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "cursos",
          key: "idCurso",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      idDisciplina: {
        primaryKey: true,
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "disciplinas",
          key: "idDisciplina",
        },
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
    await queryInterface.dropTable("cursoDisciplina");
  },
};

