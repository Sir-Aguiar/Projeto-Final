const Aluno = require("../../../database/models/Aluno");
const Escola = require("../../../database/models/Escola");
const Turma = require("../../../database/models/Turma");
/** @type {import("express").RequestHandler}  */
const CreateAlunosController = async (req, res) => {
	const { idProfessor } = req.userData;
	const { nome, idTurma } = req.body;

	if (!nome || !idTurma || isNaN(Number(idTurma))) {
		return res.status(400).json({
			error: {
				message: "Dados insuficientes ou inválidos para realizar esta ação",
			},
		});
	}

	if (nome.length > 50) {
		return res.status(400).json({
			error: {
				message: "Nome do aluno deve ter no máximo 50 caracteres",
			},
		});
	}

	try {
		const studentSchool = await Escola.findOne({
			where: { idProfessor: Number(idProfessor) },
			include: [
				{
					model: Turma,
					as: "turmas",
					where: { idTurma: Number(idTurma) },
				},
			],
		});

		if (studentSchool) {
			const insertedObject = await Aluno.create({ nome, idTurma });
			return res.status(201).json({ error: null, insertedObject });
		}

		return res.status(400).json({
			error: {
				message: "Você não possui permissão de acesasr esta turma",
			},
		});
	} catch (error) {
		return res.status(500).json({ error });
	}
};
module.exports = CreateAlunosController;
