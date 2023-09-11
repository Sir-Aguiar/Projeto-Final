const { DataTypes } = require("sequelize");
const Database = require("../database");
const Curso = Database.define(
  "Curso",
  {
    idCurso: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nome: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
  },
  { tableName: "cursos" },
);
module.exports = Curso;
