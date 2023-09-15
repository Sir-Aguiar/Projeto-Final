const { DataTypes } = require("sequelize");
const Database = require("../database");
const Escola = require("./Escola");
const ProfessorLeciona = require("./ProfessorLeciona");

const Disciplina = Database.define(
	"Disciplina",
	{
		idDisciplina: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		idEscola: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: { model: "escolas", key: "idEscola" },
			onDelete: "CASCADE",
			onUpdate: "CASCADE",
		},
		nome: {
			type: DataTypes.STRING(50),
			allowNull: false,
		},
	},
	{ tableName: "disciplinas" },
);

Disciplina.hasMany(ProfessorLeciona, { foreignKey: "idDisciplina", as: "professores" });
ProfessorLeciona.belongsTo(Disciplina, { foreignKey: "idDisciplina", as: "disciplina" });

module.exports = Disciplina;
