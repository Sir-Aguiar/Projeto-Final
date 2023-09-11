const { DataTypes } = require("sequelize");
const Database = require("../database");

const Usuario = Database.define(
  "Usuario",
  {
    idUsuario: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nome: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    senha: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  { tableName: "usuarios" },
);
module.exports = Usuario;
