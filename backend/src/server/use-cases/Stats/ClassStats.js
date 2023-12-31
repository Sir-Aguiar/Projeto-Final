const ServerError = require("../../utils/ServerError");
const Turma = require("../../../database/models/Turma");
const Aluno = require("../../../database/models/Aluno");
const Aula = require("../../../database/models/Aula");
const Chamada = require("../../../database/models/Chamada");
const Curso = require("../../../database/models/Curso");
const ChamadaAluno = require("../../../database/models/ChamadaAluno");
const Escola = require("../../../database/models/Escola");
const { Op, Sequelize } = require("sequelize");
const { VerifyClassPermission, VerifySchoolPermission } = require("../../utils/VerifyPermission");
/**
 * @param {number} idUsuario
 * @param {number} idTurma Identificador da turma desejada
 * @returns {Promise<{turma:number,curso:number}>}
 * @description Busca a relação entre os alunos de uma turma e do curso. Retornando um objeto contendo quantos alunos estão cadastrados na turma informada, junto dos alunos cadastrados no curso desta turma.
 */

const ClassPopulation = async (idTurma, idUsuario) => {
	if (!idTurma || typeof idTurma !== "number" || isNaN(Number(idTurma))) {
		throw new ServerError("O identificador da turma está ausente ou em formato inválido", 400, new Error().stack);
	}
	if (!idUsuario || typeof idUsuario !== "number" || isNaN(Number(idUsuario))) {
		throw new ServerError("O identificador do usuário está ausente ou em formato inválido", 400, new Error().stack);
	}

	/** @type {{idCurso:number, idEscola:number} | null} */
	const turma = await Turma.findByPk(idTurma, { attributes: ["idCurso", "idEscola"], raw: true, nest: true });

	if (!turma) throw new ServerError("Nenhuma turma encontrada", 404);

	const { idEscola, idCurso } = turma;

	const isUserAdmin = await VerifySchoolPermission(idEscola, idUsuario);

	if (!isUserAdmin) {
		throw new ServerError("Você não tem permissão para realizar esta ação", 401, new Error().stack);
	}

	const alunosTurma = await Aluno.count({ where: { idTurma } });

	const alunosCurso = await Aluno.count({
		where: { idEscola },
		include: [{ model: Turma, as: "turma", attributes: ["idCurso"], where: { idCurso }, required: true }],
	});

	return { turma: alunosTurma, curso: alunosCurso };
};

/**
 * @param {number} idTurma
 * @param {number} idUsuario
 */

const AvarageMonthlyAbsence = async (idTurma, idUsuario) => {
	if (!idTurma || typeof idTurma !== "number" || isNaN(Number(idTurma))) {
		throw new ServerError("O identificador da turma está ausente ou em formato inválido", 400, new Error().stack);
	}
	if (!idUsuario || typeof idUsuario !== "number" || isNaN(Number(idUsuario))) {
		throw new ServerError("O identificador do usuário está ausente ou em formato inválido", 400, new Error().stack);
	}

	const foundClass = await Turma.findByPk(idTurma, { attributes: ["idEscola"] });

	const isUserAdmin = await VerifySchoolPermission(foundClass.dataValues.idEscola, idUsuario);

	if (!isUserAdmin) {
		throw new ServerError("Você não tem permissão para realizar esta ação", 401, new Error().stack);
	}

	const currentDate = new Date();
	const currentMonth = currentDate.getMonth();
	const currentYear = currentDate.getFullYear();

	const media = [];

	for (let index = 0; index <= currentMonth; index++) {
		const monthStart = new Date(currentYear, index, 1);
		const monthEnd = new Date(currentYear, index + 1, 0);

		// Todas as aulas do mês
		const aulasDoMes = await Aula.findAll({
			where: {
				idTurma,
				createdAt: {
					[Op.gte]: monthStart,
					[Op.lt]: monthEnd,
				},
			},
			include: [
				{
					attributes: ["idChamada"],
					required: true,
					model: Chamada,
					as: "chamada",
					include: [{ required: true, model: ChamadaAluno, as: "alunos", attributes: ["idAluno", "situacao"] }],
				},
			],
			attributes: ["idAula"],
		});

		const qtdAulasNoMes = aulasDoMes.length;

		const qtdFaltas = aulasDoMes.reduce(
			(prev, aula) => prev + aula.chamada.alunos.filter((aluno) => !aluno.dataValues.situacao).length,
			0,
		);

		if (qtdFaltas <= 0) {
			media.push([monthStart.toLocaleDateString("pt-br", { month: "long" }), 0]);
		} else {
			media.push([monthStart.toLocaleDateString("pt-br", { month: "long" }), qtdFaltas / qtdAulasNoMes]);
		}
	}
	return media;
};

const ClassInfo = async (idTurma, idUsuario) => {
	if (!idTurma || typeof idTurma !== "number" || isNaN(Number(idTurma))) {
		throw new ServerError("O identificador da turma está ausente ou em formato inválido", 400, new Error().stack);
	}
	if (!idUsuario || typeof idUsuario !== "number" || isNaN(Number(idUsuario))) {
		throw new ServerError("O identificador do usuário está ausente ou em formato inválido", 400, new Error().stack);
	}

	const turma = await Turma.findByPk(idTurma, {
		attributes: ["idTurma", "nome"],
		include: [
			{
				model: Escola,
				as: "escola",
				attributes: ["idEscola", "idGestor", "nome"],
			},
			{
				model: Curso,
				as: "curso",
				attributes: ["idCurso", "nome"],
			},
		],
		raw: true,
		nest: true,
	});

	const isUserAdmin = await VerifySchoolPermission(turma.escola.idEscola, idUsuario);

	if (!isUserAdmin) {
		throw new ServerError("Você não tem permissão para realizar esta ação", 401, new Error().stack);
	}

	const alunos = await Aluno.findAll({
		where: {
			idTurma,
		},
		attributes: ["idAluno", "nome"],
		include: [{ model: ChamadaAluno, as: "chamadas" }],
	});

	return {
		turma,
		alunos: alunos
			.map((aluno) => ({
				idAluno: aluno.idAluno,
				nome: aluno.nome,
				faltas: aluno.chamadas.filter((chamada) => !chamada.dataValues.situacao).length,
			}))
			.sort((a, b) => b.faltas - a.faltas),
	};
};
module.exports = { ClassPopulation, AvarageMonthlyAbsence, ClassInfo };
