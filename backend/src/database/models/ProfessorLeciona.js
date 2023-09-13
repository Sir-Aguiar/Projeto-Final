const { DataTypes } = require("sequelize");
const Database = require("../database");

const ProfessorLeciona = Database.define(
	"ProfessorLeciona",
	{
		idLeciona: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		idProfessor: {
			type: DataTypes.INTEGER,
			references: { model: "usuarios", key: "idUsuario" },
			allowNull: false,
		},
		idDisciplina: {
			type: DataTypes.INTEGER,
			references: { model: "disciplinas", key: "idDisciplina" },
			allowNull: false,
		},
		idTurma: {
			type: DataTypes.INTEGER,
			references: { model: "turmas", key: "idTurma" },
			allowNull: false,
		},
	},
	{ tableName: "professorLeciona" },
);

module.exports = ProfessorLeciona;
