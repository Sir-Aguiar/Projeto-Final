const { Op } = require("sequelize");
const ChamadaAluno = require("../../../database/models/ChamadaAluno");
const FindStudentById = require("../Alunos/FindById");
const Chamada = require("../../../database/models/Chamada");
const Aula = require("../../../database/models/Aula");
const Turma = require("../../../database/models/Turma");
const Aluno = require("../../../database/models/Aluno");
const Disciplina = require("../../../database/models/Disciplina");
const Curso = require("../../../database/models/Curso");
const Escola = require("../../../database/models/Escola");

/**
 *
 * @param {number} idAluno Identificador do aluno
 * @returns {Promise<(string | number)[][]>} Retorna um array contendo as faltas mensais do aluno informado.
 */

const MonthlyAbsence = async (idAluno) => {
	/* const aluno = await FindStudentById(idAluno); */

	const faltas = await ChamadaAluno.findAll({
		where: { idAluno, situacao: false },
		raw: true,
		nest: true,
	});

	const faltasPorMes = [];

	const currentDate = new Date();

	const currentYear = currentDate.getFullYear();
	const currentMonth = currentDate.getMonth();

	for (let index = 0; index <= currentMonth; index++) {
		const startMonth = new Date(currentYear, index, 1);
		const endMonth = new Date(currentYear, index + 1, 0);

		faltasPorMes.push([
			startMonth.toLocaleDateString("pt-br", { month: "long" }),
			faltas.filter((falta) => {
				const createdAt = new Date(falta.createdAt);
				return createdAt >= startMonth && createdAt <= endMonth;
			}).length,
		]);
	}
	return faltasPorMes;
};

/**
 * @typedef {object} Disciplina
 * @property {number} idDisciplina
 * @property {string} nome
 *
 * @param {number} idAluno Identificador do aluno
 * @param {number} month Número do mês desejado, onde 0 = Janeiro e 11 = Dezembro
 * @returns {Promise<{faltas:number, disciplinas:Disciplina[]}>} Esta função informará a quantidade de faltas do aluno no mês, contendo também a disposição por disciplinas
 */

const MonthAbscence = async (idAluno, month) => {
	const currentDate = new Date();

	const currentYear = currentDate.getFullYear();
	const startMonth = new Date(currentYear, month, 1);
	const endMonth = new Date(currentYear, month + 1, 0);

	const faltas = await ChamadaAluno.findAll({
		where: {
			idAluno,
			situacao: false,
			createdAt: {
				[Op.gte]: startMonth,
				[Op.lte]: endMonth,
			},
		},
		include: [
			{
				attributes: [],
				model: Chamada,
				as: "chamada",
				required: true,
				include: [
					{
						model: Aula,
						as: "aula",
						include: [{ model: Disciplina, as: "disciplina", required: true, attributes: [] }],
						required: true,
						attributes: [],
					},
				],
				attributes: [],
			},
		],
		attributes: ["chamada.aula.idDisciplina", "chamada.aula.disciplina.nome"],
		raw: true,
		nest: true,
	});

	const disciplinesMap = new Map();
	const disciplinasFalta = [];

	const uniqueDisciplines = faltas.filter((falta) => {
		if (!disciplinesMap.has(falta.idDisciplina)) {
			disciplinesMap.set(falta.idDisciplina, falta);
			return falta;
		}
	});

	for (const disciplina of uniqueDisciplines) {
		disciplinasFalta.push({
			disciplina,
			faltas: faltas.filter((falta) => falta.idDisciplina === disciplina.idDisciplina).length,
		});
	}

	return {
		faltas: faltas.length,
		disciplinas: disciplinasFalta,
	};
};

/**
 * @param {number} idCurso Identificador do curso
 * @param {number} month Número do mês desejado, onde 0 = Janeiro e 11 = Dezembro
 * @description Esta função retorna a média de faltas dos alunos do curso informado, no mês informado
 */
const AvarageMonthAbscenceInCourse = async (idAluno, month) => {
	const currentDate = new Date();

	const currentYear = currentDate.getFullYear();
	const startMonth = new Date(currentYear, month, 1);
	const endMonth = new Date(currentYear, month + 1, 0);

	const foundStudent = await Aluno.findByPk(idAluno, {
		attributes: ["idAluno", "nome"],
		include: [
			{
				model: Turma,
				as: "turma",
				attributes: ["idTurma", "nome"],
				include: [{ model: Curso, as: "curso", attributes: ["idCurso", "nome"] }],
			},
			{ model: Escola, as: "escola", attributes: ["idEscola", "idGestor", "nome"] },
		],
		raw: true,
		nest: true,
	});

	const faltas = await ChamadaAluno.findAll({
		where: {
			situacao: false,
			createdAt: {
				[Op.gte]: startMonth,
				[Op.lte]: endMonth,
			},
		},
		include: [
			{
				model: Chamada,
				as: "chamada",
				include: [
					{
						model: Aula,
						as: "aula",
						include: [
							{
								model: Turma,
								as: "turma",
								where: { idCurso: foundStudent.turma.curso.idCurso, idEscola: foundStudent.escola.idEscola },
								required: true,
							},
						],
						required: true,
					},
				],
				required: true,
			},
		],
		raw: true,
		nest: true,
	});

	const studentsMap = new Map();

	const uniqueStudents = faltas.filter((falta) => {
		if (!studentsMap.has(falta.idAluno)) {
			studentsMap.set(falta.idAluno, falta.idAluno);
			return true;
		}
	});
	if (faltas.length === 0) return 0;
	return Number((faltas.length / uniqueStudents.length).toFixed(2));
};

const TotalAbscence = async (idAluno) => {
	const currentDate = new Date();

	const currentYear = currentDate.getFullYear();
	const startYear = new Date(currentYear, 0, 1);
	const endYear = new Date(currentYear + 1, 0, 1);
	const faltas = await ChamadaAluno.count({
		where: {
			idAluno,
			situacao: false,
			createdAt: {
				[Op.gte]: startYear,
				[Op.lt]: endYear,
			},
		},
	});

	return faltas;
};

module.exports = { TotalAbscence, AvarageMonthAbscenceInCourse, MonthAbscence, MonthlyAbsence };
