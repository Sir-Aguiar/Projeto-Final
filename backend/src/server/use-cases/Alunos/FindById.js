const Aluno = require("../../../database/models/Aluno");
const Turma = require("../../../database/models/Turma");
const Curso = require("../../../database/models/Curso");
const Escola = require("../../../database/models/Escola");
const ServerError = require("../../utils/ServerError");
const { VerifySchoolPermission, VerifyClassPermission } = require("../../utils/VerifyPermission");
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

const FindStudentById = async (idAluno, idUsuario) => {
	if (!idUsuario || typeof idUsuario !== "number") {
		throw new ServerError("O identificador do usuário está ausente ou em formato inválido", 400, new Error().stack);
	}
	if (!idAluno || typeof idAluno !== "number" || isNaN(Number(idAluno))) {
		throw new ServerError("O identificador do usuário está ausente ou em formato inválido", 400, new Error().stack);
	}

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

	const isUserAdmin = await VerifySchoolPermission(aluno.escola.idEscola, idUsuario);

	if (!isUserAdmin) {
		const isUserProfessor = await VerifyClassPermission(aluno.turma.idTurma, idUsuario);
		if (!isUserProfessor) {
			throw new ServerError("Você não possui autorização para realizar esta ação", 401, new Error().stack);
		}
	}

	return aluno;
};

module.exports = FindStudentById;
