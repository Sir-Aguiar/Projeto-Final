const { DataTypes } = require("sequelize");
const Chamada = require("./Chamada");
const Aluno = require("./Aluno");
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

Aluno.hasMany(ChamadaAluno, { foreignKey: "idAluno", as: "chamadas" });
ChamadaAluno.belongsTo(Aluno, { foreignKey: "idAluno", as: "aluno" });

Aluno.belongsToMany(Chamada, { through: ChamadaAluno, foreignKey: "idAluno" });
Chamada.belongsToMany(Aluno, { through: ChamadaAluno, foreignKey: "idChamada" });

Chamada.hasMany(ChamadaAluno, { foreignKey: "idChamada", as: "alunos" });
ChamadaAluno.belongsTo(Chamada, { foreignKey: "idChamada", as: "chamada" });
module.exports = ChamadaAluno;
