const { DataTypes } = require("sequelize");
const Database = require("../database");
const Escola = Database.define(
  "Escola",
  {
    idEscola: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    idGestor: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "usuarios",
        key: "idUsuario",
      },
    },
    nome: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
  },
  { tableName: "escolas" },
);
module.exports = Escola;
