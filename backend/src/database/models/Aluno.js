const { DataTypes } = require("sequelize");
const Database = require("../database");
const Aluno = Database.define(
  "Aluno",
  {
    idAluno: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
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
    idEscola: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "escolas",
        key: "idEscola",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    nome: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
  },
  { tableName: "alunos" },
);


module.exports = Aluno;
