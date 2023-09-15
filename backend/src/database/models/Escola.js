const { DataTypes } = require("sequelize");
const Database = require("../database");
const Turma = require("./Turma");
const Aluno = require("./Aluno");
const Disciplina = require("./Disciplina");
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
			onDelete: "CASCADE",
			onUpdate: "CASCADE",
		},
		nome: {
			type: DataTypes.STRING(150),
			allowNull: false,
		},
	},
	{ tableName: "escolas" },
);

Escola.hasMany(Turma, {
	foreignKey: "idEscola",
	as: "turmas",
});
Turma.belongsTo(Escola, {
	foreignKey: "idEscola",
	as: "escola",
});

Escola.hasMany(Disciplina, {
	foreignKey: "idEscola",
	as: "disciplinas",
});

Disciplina.belongsTo(Escola, {
	foreignKey: "idEscola",
	as: "escola",
});

Escola.hasMany(Aluno, { foreignKey: "idEscola", as: "alunos" });
Aluno.belongsTo(Escola, { foreignKey: "idEscola", as: "escola" });

module.exports = Escola;
