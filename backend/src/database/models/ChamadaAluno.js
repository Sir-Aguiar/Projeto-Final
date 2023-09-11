const { DataTypes } = require("sequelize");
const Database = require("../database");
const ChamadaAluno = Database.define(
  "ChamadaAluno",
  {
    idChamada: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: {
        model: "chamadas",
        key: "idChamada",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    idAluno: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: {
        model: "alunos",
        key: "idAluno",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    situacao: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
  },
  { tableName: "chamadaAluno" },
);
module.exports = ChamadaAluno;
