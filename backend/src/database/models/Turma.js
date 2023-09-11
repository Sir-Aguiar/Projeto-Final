const { DataTypes } = require("sequelize");
const Database = require("../database");
const Turma = Database.define(
  "Turma",
  {
    idTurma: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    idEscola: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "escolas", key: "idEscola" },
      onDelete: "CASCADE",
    },
    idCurso: {
      type: DataTypes.INTEGER,
      references: { model: "cursos", key: "idCurso" },
      allowNull: false,
      onDelete: "CASCADE",
    },
    nome: { type: DataTypes.STRING(15), allowNull: false },
  },
  { tableName: "turmas" },
);
module.exports = Turma;
