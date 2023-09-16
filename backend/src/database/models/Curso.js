const Turma = require("./Turma");
const Disciplina = require("./Disciplina");
const { DataTypes } = require("sequelize");
const Database = require("../database");

const Curso = Database.define(
	"Curso",
	{
		idCurso: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		nome: {
			type: DataTypes.STRING(50),
			allowNull: false,
		},
	},
	{ tableName: "cursos", timestamps: false },
);

Curso.hasMany(Turma, { foreignKey: "idCurso", as: "turmas" });
Turma.belongsTo(Curso, { foreignKey: "idCurso", as: "curso" });

module.exports = Curso;
