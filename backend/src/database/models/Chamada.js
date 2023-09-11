const { DataTypes } = require("sequelize");
const Database = require("../database");
const Chamada = Database.define(
  "Chamada",
  {
    idChamada: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    idAula: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "aulas",
        key: "idAula",
      },
    },
  },
  { tableName: "chamadas" },
);
module.exports = Chamada;
