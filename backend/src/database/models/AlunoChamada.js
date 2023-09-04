const Database = require("../database");
const { DataTypes } = require("sequelize");

const Aluno = require("./Aluno");
const Chamada = require("./Chamada");

const AlunoChamada = Database.define(
	"AlunoChamada",
	{
		idRelacao: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
		idAluno: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		idChamada: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		situacao: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
			allowNull: false,
		},
	},
	{ tableName: "alunoChamada" },
);

Aluno.hasMany(AlunoChamada, {
	foreignKey: "idAluno",
});

AlunoChamada.belongsTo(Aluno, {
	foreignKey: "idAluno",
	as: "aluno",
});

Chamada.hasMany(AlunoChamada, {
	foreignKey: "idChamada",
});
AlunoChamada.belongsTo(Chamada, {
	foreignKey: "idChamada",
	as: "chamada",
});

module.exports = AlunoChamada;
