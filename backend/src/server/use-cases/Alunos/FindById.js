const Aluno = require("../../../database/models/Aluno");
const Turma = require("../../../database/models/Turma");
const Curso = require("../../../database/models/Curso");
const Escola = require("../../../database/models/Escola");
/**
 * @typedef {object} Curso
 *  @property {number} idCurso
 * @property {string} nome
 */

/**
 * @typedef {object} Turma
 *  @property {number} idTurma
 * @property {string} nome
 * @property {Curso} curso
 */
/**
 * @typedef {object} Escola
 *  @property {number} idEscola
 *  @property {number} idGestor
 * @property {string} nome
 */

/**
 * @typedef {object} Aluno
 * @property {number} idAluno
 * @property {string} nome
 * @property {Turma} turma
 * @property {Escola} escola
 */

/**
 *
 * @param {number} idAluno Identificador do aluno
 * @returns {Promise<Aluno>} Objeto contendo todas as informações do aluno
 */

const FindStudentById = async (idAluno) => {
	const aluno = await Aluno.findByPk(idAluno, {
		attributes: ["idAluno", "nome"],
		include: [
			{
				model: Turma,
				as: "turma",
				attributes: ["idTurma", "nome"],
				include: [{ model: Curso, as: "curso", attributes: ["idCurso", "nome"] }],
			},
			{
				model: Escola,
				as: "escola",
				attributes: ["idEscola", "idGestor", "nome"],
			},
		],
		raw: true,
		nest: true,
	});
	return aluno;
};

module.exports = FindStudentById;
