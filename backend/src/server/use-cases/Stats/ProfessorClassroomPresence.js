const { Sequelize } = require("sequelize");
const Aula = require("../../../database/models/Aula");
const Usuario = require("../../../database/models/Usuario");

/**
 *
 * @param {number} idTurma Identificador da turma
 */

const CountProfessorsClassRoomByClass = async (idTurma) => {
	const aulas = await Aula.findAll({
		where: { idTurma },
		include: [{ model: Usuario, as: "professor", attributes: ["idUsuario", "nome"] }],
		attributes: ["idAula"],
		raw: true,
		nest: true,
	});

	const professorsMap = new Map();
	const uniqueProfessors = aulas.filter((aula) => {
		if (!professorsMap.has(aula.professor.idUsuario)) {
			professorsMap.set(aula.professor.idUsuario, aula.professor);
			return aula.professor;
		}
	});

	const data = [];

	for (const professor of uniqueProfessors) {
		data.push([
			professor.professor,
			await Aula.count({
				where: { idTurma, idProfessor: professor.professor.idUsuario },
			}),
		]);
	}

	return data;
};

module.exports = CountProfessorsClassRoomByClass;
