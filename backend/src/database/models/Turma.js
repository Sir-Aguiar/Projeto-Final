const { DataTypes } = require("sequelize");
const Database = require("../database");
const Escola = require("./Escola");
const Aluno = require("./Aluno");
const Chamada = require("./Chamada");

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
          msg: "Está série/ano escolar não está cadastrada em nosso sistema",
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
  onDelete: "CASCADE",
});

Escola.hasMany(Turma, {
  onDelete: "CASCADE",
  foreignKey: "idEscola",
  as: "turmas",
});

Turma.hasMany(Chamada, {
  foreignKey: "idTurma",
  as: "chamadas",
});

Chamada.belongsTo(Turma, {
  foreignKey: "idTurma",
  as: "turma",
});

Aluno.belongsTo(Turma, {
  foreignKey: "idTurma",
  as: "turma",
});
Turma.hasMany(Aluno, {
  foreignKey: "idTurma",
  as: "alunos",
});

module.exports = Turma;
