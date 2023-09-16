const { DataTypes } = require("sequelize");
const Database = require("../database");

const ProfessorLeciona = Database.define(
  "ProfessorLeciona",
  {
    idLeciona: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    idProfessor: {
      type: DataTypes.INTEGER,
      references: { model: "usuarios", key: "idUsuario" },
      allowNull: false,
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    idDisciplina: {
      type: DataTypes.INTEGER,
      references: { model: "disciplinas", key: "idDisciplina" },
      allowNull: false,
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    idTurma: {
      type: DataTypes.INTEGER,
      references: { model: "turmas", key: "idTurma" },
      allowNull: false,
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
  },
  { tableName: "professorLeciona", timestamps: false },
);

module.exports = ProfessorLeciona;
