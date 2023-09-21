const Curso = require("./Curso");
const Disciplina = require("./Disciplina");

const { DataTypes } = require("sequelize");
const Database = require("../database");
const CursoDisciplina = Database.define(
	"CursoDisciplina",
	{
		idCurso: {
			primaryKey: true,
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: "cursos",
				key: "idCurso",
			},
			onDelete: "CASCADE",
			onUpdate: "CASCADE",
		},
		idDisciplina: {
			primaryKey: true,
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: "disciplinas",
				key: "idDisciplina",
			},
			onDelete: "CASCADE",
			onUpdate: "CASCADE",
		},
	},
	{ tableName: "cursoDisciplina" },
);

/* Curso.belongsToMany(Disciplina, { through: CursoDisciplina, foreignKey: "idCurso" });
Disciplina.belongsToMany(Curso, { through: CursoDisciplina, foreignKey: "idDisciplina" }); */

Curso.hasMany(CursoDisciplina, {
	foreignKey: "idCurso",
	as: "grade",
});
CursoDisciplina.belongsTo(Curso, {
	foreignKey: "idCurso",
	as: "curso",
});

Disciplina.hasMany(CursoDisciplina, {
	foreignKey: "idDisciplina",
});
CursoDisciplina.belongsTo(Disciplina, {
	foreignKey: "idDisciplina",
	as: "disciplina",
});

module.exports = CursoDisciplina;
