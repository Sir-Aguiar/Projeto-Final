const { DataTypes } = require("sequelize");
const Database = require("../database");
const Aula = Database.define(
  "Aula",
  {
    idAula: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    idTurma: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "turmas",
        key: "idTurma",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    idDisciplina: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "disciplinas",
        key: "idDisciplina",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    idProfessor: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "usuarios",
        key: "idUsuario",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    anotacao: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
    },
  },
  { tableName: "aulas" },
);
module.exports = Aula;
