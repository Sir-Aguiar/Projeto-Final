const { DataTypes } = require("sequelize");
const Database = require("../database");
const Disciplina = Database.define(
  "Disciplina",
  {
    idDisciplina: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    idEscola: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "escolas", key: "idEscola" },
      onDelete: "CASCADE",
    },
    nome: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
  },
  { tableName: "disciplinas" },
);
module.exports = Disciplina;
