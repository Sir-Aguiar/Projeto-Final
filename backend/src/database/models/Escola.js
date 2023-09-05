const { DataTypes } = require("sequelize");
const Database = require("../database");
const Professor = require("./Professor");

const Escola = Database.define(
  "Escola",
  {
    idEscola: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    idProfessor: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    nome: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
  },
  {
    tableName: "escolas",
  },
);



module.exports = Escola;
