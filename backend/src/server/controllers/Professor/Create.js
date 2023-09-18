const Usuario = require("../../../database/models/Usuario");
const Escola = require("../../../database/models/Escola");
const ProfessorLeciona = require("../../../database/models/ProfessorLeciona");
const Turma = require("../../../database/models/Turma");
const Disciplina = require("../../../database/models/Disciplina");
const CursoDisciplina = require("../../../database/models/CursoDisciplina");
/** @type {import("express").RequestHandler}  */
const CreateProfessorController = async (req, res) => {
	const { idUsuario } = req.userData;
	const { email, lectures } = req.body;
	if (!email || !lectures || lectures.length < 1) {
		return res.status(400).json({});
	}

	try {
		// Achar o usuário em questão
		const foundProfessor = await Usuario.findOne({ where: { email } });

		if (!foundProfessor) {
			return res.status(404).json({});
		}

		for (const lecture of lectures) {
			const { idDisciplina, idTurma } = lecture;

			const foundDiscipline = await Disciplina.findByPk(idDisciplina, { include: [{ model: Escola, as: "escola" }] });
			if (!foundDiscipline) {
				return;
			}

			const foundClass = await Turma.findByPk(idTurma, { include: [{ model: Escola, as: "escola" }] });
			if (!foundClass) {
				return;
			}

			if (foundClass.dataValues.idEscola !== foundDiscipline.dataValues.idEscola) {
				return;
			}

			if (foundClass.dataValues.escola.idGestor !== idUsuario) {
				return;
			}

			const disciplineCourse = await CursoDisciplina.findOne({
				where: { idDisciplina, idCurso: foundClass.dataValues.idCurso },
			});

			if (!disciplineCourse) {
				return;
			}

			await ProfessorLeciona.create({ idProfessor: foundProfessor.idUsuario, idDisciplina, idTurma });
		}

		return res.status(201).json({ error: null });
	} catch (error) {
		return res.status(500).json(error);
	}
};

module.exports = CreateProfessorController;
