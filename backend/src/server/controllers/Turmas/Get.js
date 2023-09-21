const Aluno = require("../../../database/models/Aluno");
const Curso = require("../../../database/models/Curso");
const Escola = require("../../../database/models/Escola");
const ProfessorLeciona = require("../../../database/models/ProfessorLeciona");
const Usuario = require("../../../database/models/Usuario");
const Turma = require("../../../database/models/Turma");
const Disciplina = require("../../../database/models/Disciplina");
/** @type {import("express").RequestHandler}  */
const GetTurmasController = async (req, res) => {
	const { idUsuario } = req.userData;
	const { idEscola, idTurma } = req.query;
	try {
		if (idEscola) {
			const foundSchool = await Escola.findOne({ where: { idEscola } });

			if (!foundSchool) {
				return res.status(404).json({
					error: {
						message: "Nenhuma escola foi encontrada com este ID",
					},
				});
			}

			if (foundSchool.dataValues.idGestor !== idUsuario) {
				const turmas = await Turma.findAll({
					where: { idEscola },
					include: [
						{
							model: ProfessorLeciona,
							as: "professores",
							where: {
								idProfessor: idUsuario,
							},
							attributes: [],
						},
					],
				});

				if (turmas.length < 1) {
					return res.status(401).json({});
				}

				return res.status(200).json({ error: null, turmas });
			}

			const turmas = await Turma.findAll({ where: { idEscola } });
			return res.status(200).json({ error: null, turmas });
		}

		if (idTurma) {
			const turma = await Turma.findByPk(idTurma, {
				include: [
					{ model: Escola, as: "escola" },
					{ model: Aluno, as: "alunos", attributes: ["idAluno", "nome"] },
					{ model: Curso, as: "curso" },
					{
						model: ProfessorLeciona,
						as: "professores",
						attributes: ["idProfessor", "idDisciplina"],
						include: [
							{ model: Usuario, as: "professor", attributes: ["nome"] },
							{ model: Disciplina, as: "disciplina", attributes: ["nome"] },
						],
					},
				],
				attributes: ["idTurma", "nome"],
			});

			if (turma.toJSON().escola.idGestor !== idUsuario) {
				const OBJECT_TO_NOT_MANAGER = turma.toJSON();

				OBJECT_TO_NOT_MANAGER.professores = OBJECT_TO_NOT_MANAGER.professores.filter(
					(some_class) => some_class.idProfessor === idUsuario,
				);
				if (OBJECT_TO_NOT_MANAGER.professores.length < 1) {
					return res.status(401).json({});
				}
				return res.status(200).json({ error: null, turma: OBJECT_TO_NOT_MANAGER });
			}

			if (!turma) {
				return res.status(404).json({});
			}

			return res.status(200).json({ error: null, turma });
		}

		// All classes
		const OWNED_CLASSES = await Turma.findAll({
			include: [
				{ model: Escola, as: "escola", attributes: ["idEscola", "nome", "idGestor"], where: { idGestor: idUsuario } },
				{ model: Curso, as: "curso", attributes: ["idCurso", "nome"] },
			],
			raw: true,
			nest: true,
			attributes: ["idTurma", "nome"],
		});

		const ASSOCIATED_CLASSES = await ProfessorLeciona.findAll({
			where: { idProfessor: idUsuario },
			include: [
				{
					model: Turma,
					as: "turma",
					attributes: ["idTurma", "nome"],
					include: [
						{
							model: Curso,
							as: "curso",
							attributes: ["idCurso", "nome"],
						},
						{
							model: Escola,
							as: "escola",
							attributes: ["idEscola", "nome", "idGestor"],
						},
					],
				},
			],
			raw: true,
			nest: true,
			attributes: [],
		});

		const turmas = [];
		const resultMap = new Map();

		OWNED_CLASSES.forEach((turma) => {
			const { idTurma, nome, curso, escola } = turma;
			if (!resultMap.has(idTurma)) {
				resultMap.set(idTurma, { idTurma, nome, curso, escola });
			}
		});

		ASSOCIATED_CLASSES.forEach((result) => {
			const { turma } = result;
			const { idTurma, nome, curso, escola } = turma;
			if (!resultMap.has(idTurma)) {
				resultMap.set(idTurma, { idTurma, nome, curso, escola });
			}
		});

		resultMap.forEach((value) => {
			turmas.push(value);
		});

		turmas.sort((a, b) => a.idTurma - b.idTurma);

		return res.status(200).json({ error: null, turmas });
	} catch (error) {
		return res.status(500).json({ error });
	}
};

module.exports = GetTurmasController;
