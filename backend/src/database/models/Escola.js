const { DataTypes } = require("sequelize");
const Database = require("../database");
const Professor = require("./Professor");

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
	},
	{
		tableName: "escolas",
	},
);

Escola.belongsTo(Professor, {
	foreignKey: "idProfessor",
	as: "professor",
});
Professor.hasMany(Escola, {
	foreignKey: "idProfessor",
	as: "escolas",
});

module.exports = Escola;
