const { ValidationError, json } = require("sequelize");
const Escola = require("../../../database/models/Escola");
const Turma = require("../../../database/models/Turma");
/** @type {import("express").RequestHandler}  */
const CreateTurmaController = async (req, res) => {
	const { idUsuario } = req.userData;
	const { idEscola } = req.query;
	const { turmas } = req.body;

	if (isNaN(Number(idEscola))) {
		return res.status(400).json({
			error: {
				message: "Dados inválidos para realizar esta ação",
			},
		});
	}

	if (!turmas || turmas.length <= 0) {
		return res.status(400).json({
			error: {
				message: "Insira turmas para serem adicionadas",
			},
		});
	}

	try {
		const foundSchool = await Escola.findOne({ where: { idEscola } });

		if (!foundSchool) {
			return res.status(404).json({
				error: {
					message: "Nenhuma escola foi encontrada com este ID",
				},
			});
		}

		if (foundSchool.dataValues.idGestor !== idUsuario) {
			return res.status(401).json({
				error: {
					message: "Você não possui acesso à esta escola",
				},
			});
		}

		for (const turma of turmas) {
			console.log(turma)
			await Turma.create({ idEscola: Number(idEscola), idCurso: Number(turma.idCurso), nome: turma.nome });
		}
		return res.status(201).json({ error: null });
	} catch (error) {
		console.log(error)
		if (error instanceof ValidationError) {
			return res.status(404).json({
				error: {
					message: error.errors[0].message,
				},
			});
		}
		return res.status(500).json(error);
	}
};

module.exports = CreateTurmaController;
