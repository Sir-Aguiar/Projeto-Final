const Database = require("../database");
const { DataTypes } = require("sequelize");

const Chamada = Database.define(
	"Chamada",
	{
		idChamada: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		idTurma: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
	},
	{ tableName: "chamadas" },
);

module.exports = Chamada;
