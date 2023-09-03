const { DataTypes } = require("sequelize");
const Turma = require("./Turma");
const Database = require("../database");

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
    EF1: { type: DataTypes.STRING(3), defaultValue: "EF1" },
    EF2: { type: DataTypes.STRING(3), defaultValue: "EF2" },
    EF3: { type: DataTypes.STRING(3), defaultValue: "EF3" },
    EF4: { type: DataTypes.STRING(3), defaultValue: "EF4" },
    EF5: { type: DataTypes.STRING(3), defaultValue: "EF5" },
    EF6: { type: DataTypes.STRING(3), defaultValue: "EF6" },
    EF7: { type: DataTypes.STRING(3), defaultValue: "EF7" },
    EF8: { type: DataTypes.STRING(3), defaultValue: "EF8" },
    EF9: { type: DataTypes.STRING(3), defaultValue: "EF9" },
    EM1: { type: DataTypes.STRING(3), defaultValue: "EM1" },
    EM2: { type: DataTypes.STRING(3), defaultValue: "EM2" },
    EM3: { type: DataTypes.STRING(3), defaultValue: "EM3" },
  },
  {
    tableName: "escolas",
  },
);

Escola.hasMany(Turma, {
  foreignKey: "idEscola",
  as: "turmas",
});

module.exports = Escola;
