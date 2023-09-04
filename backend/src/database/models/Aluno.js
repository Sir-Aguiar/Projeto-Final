const Database = require("../database");
const { DataTypes } = require("sequelize");
const Turma = require("./Turma");

const Aluno = Database.define(
	"Aluno",
	{
		idAluno: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		idTurma: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: "turmas",
				key: "idTurma",
			},
		},
		nome: {
			type: DataTypes.STRING(50),
			allowNull: false,
		},
	},
	{ tableName: "alunos" },
);

Aluno.belongsTo(Turma, {
	foreignKey: "idTurma",
	as: "turma",
});
Turma.hasMany(Aluno, {
	foreignKey: "idTurma",
	as: "alunos",
});

module.exports = Aluno;
