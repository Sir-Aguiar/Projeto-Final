const { DataTypes } = require("sequelize");
const Database = require("../database");
const Professor = Database.define(
	"Professor",
	{
		idProfessor: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		nome: {
			type: DataTypes.STRING(150),
			allowNull: false,
		},
		email: {
			type: DataTypes.STRING(255),
			allowNull: false,
			unique: true,
		},
		senha: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		login: {
			type: DataTypes.STRING(30),
			unique: true,
			allowNull: false,
		},
	},
	{
		tableName: "professores",
	},
);

module.exports = Professor;
