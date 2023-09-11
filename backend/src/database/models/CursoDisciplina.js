const { DataTypes } = require("sequelize");
const Database = require("../database");
const CursoDisciplina = Database.define(
  "CursoDisciplina",
  {
    idCurso: {
      primaryKey: true,
      type: DataTypes.INTEGER,
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
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "disciplinas",
        key: "idDisciplina",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
  },
  { tableName: "cursoDisciplina" },
);
module.exports = CursoDisciplina;
