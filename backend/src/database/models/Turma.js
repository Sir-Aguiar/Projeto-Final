const { DataTypes } = require("sequelize");
const Aluno = require("./Aluno");
const Aula = require("./Aula");
const Database = require("../database");
const ProfessorLeciona = require("./ProfessorLeciona");
const Turma = Database.define(
  "Turma",
  {
    idTurma: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    idEscola: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "escolas", key: "idEscola" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    idCurso: {
      type: DataTypes.INTEGER,
      references: { model: "cursos", key: "idCurso" },
      allowNull: false,
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    nome: { type: DataTypes.STRING(15), allowNull: false },
  },
  { tableName: "turmas", timestamps: false },
);

Turma.hasMany(Aluno, { foreignKey: "idTurma", as: "alunos" });
Aluno.belongsTo(Turma, { foreignKey: "idTurma", as: "turma" });

Turma.hasMany(Aula, { foreignKey: "idTurma", as: "aulas" });
Aula.belongsTo(Turma, { foreignKey: "idTurma", as: "turma" });

Turma.hasMany(ProfessorLeciona, { foreignKey: "idTurma", as: "professores" });
ProfessorLeciona.belongsTo(Turma, { foreignKey: "idTurma", as: "turma" });

module.exports = Turma;
