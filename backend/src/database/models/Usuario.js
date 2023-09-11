const { DataTypes } = require("sequelize");
const Database = require("../database");
const Escola = require("./Escola");
const ProfessorLeciona = require("./ProfessorLeciona");

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

Usuario.hasMany(Escola, {
  foreignKey: "idGestor",
  as: "escolas",
});

Escola.belongsTo(Usuario, {
  foreignKey: "idGestor",
  as: "gestor",
});

Usuario.hasMany(ProfessorLeciona, { foreignKey: "idProfessor", as: "professorLeciona" });
ProfessorLeciona.belongsTo(Usuario, { foreignKey: "idProfessor", as: "professor" });

module.exports = Usuario;
