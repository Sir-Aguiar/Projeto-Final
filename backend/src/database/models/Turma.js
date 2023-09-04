const { DataTypes } = require("sequelize");
const Database = require("../database");
const Escola = require("./Escola");

const Turma = Database.define(
  "Turma",
  {
    idTurma: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    idSerie: {
      type: DataTypes.STRING(3),
      allowNull: false,
      validate: {
        isIn: {
          args: [["EF1", "EF2", "EF3", "EF4", "EF5", "EF6", "EF7", "EF8", "EF9", "EM1", "EM2", "EM3"]],
          msg: "Série inválida",
        },
      },
    },
    idEscola: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    nome: {
      type: DataTypes.STRING(15),
      allowNull: false,
    },
  },
  { tableName: "turmas" },
);

Turma.belongsTo(Escola, {
  foreignKey: "idEscola",
  as: "escola",
});

module.exports = Turma;