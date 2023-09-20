const { json } = require("sequelize");
const Escola = require("../../../database/models/Escola");
const Disciplina = require("../../../database/models/Disciplina");
const Aula = require("../../../database/models/Aula");
const ChamadaAluno = require("../../../database/models/ChamadaAluno");
const ProfessorLeciona = require("../../../database/models/ProfessorLeciona");
const Turma = require("../../../database/models/Turma");
const Aluno = require("../../../database/models/Aluno");
const Chamada = require("../../../database/models/Chamada");
/** @type {import("express").RequestHandler}  */
const CreateAulaController = async (req, res) => {
	const { idUsuario } = req.userData;
	const { idDisciplina, idTurma, idProfessor } = req.body;
	const { observacoes, presentes } = req.body;

	if (!idDisciplina || !idTurma || !idProfessor || !presentes) {
		return res.status(400).json({});
	}

	try {
		if (idProfessor !== idUsuario) {
			return res.status(401).json({
				error: {
					message: "Você não pode atribuir uma aula à outro usuário",
				},
			});
		}

		const foundRelation = await ProfessorLeciona.findOne({ where: { idProfessor, idDisciplina, idTurma } });

		if (!foundRelation) {
			return res.status(401).json({
				error: {
					message: "Você não leciona à esta turma",
				},
			});
		}

		const foundClass = await Turma.findByPk(idTurma, {
			attributes: ["idTurma"],
			include: [{ model: Aluno, as: "alunos", attributes: ["idAluno"] }],
		});

		const studentsFromClass = foundClass.dataValues.alunos.map((aluno) => aluno.dataValues.idAluno);

		for (const idAluno of presentes) {
			if (!studentsFromClass.includes(idAluno)) {
				res.status(401).json({
					error: {
						message: "Aluno não pertence à esta turma",
					},
				});
				break;
			}
		}

		const createdClass = await Aula.create({
			idDisciplina,
			idTurma,
			idProfessor: idUsuario,
			anotacao: observacoes || null,
		});

		const createdList = await Chamada.create({ idAula: createdClass.dataValues.idAula });

		for (const aluno of studentsFromClass) {
			await ChamadaAluno.create({
				idChamada: createdList.dataValues.idChamada,
				idAluno: aluno,
				situacao: presentes.includes(aluno),
			});
		}

		return res.status(201).json({ error: null });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ error });
	}
};

module.exports = CreateAulaController;
