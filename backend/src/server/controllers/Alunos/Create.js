const Aluno = require("../../../database/models/Aluno");
const Escola = require("../../../database/models/Escola");
const Turma = require("../../../database/models/Turma");
/** @type {import("express").RequestHandler}  */
const CreateAlunosController = async (req, res) => {
	const { idUsuario } = req.userData;
	const { alunos } = req.body;

	if (!alunos || alunos.length <= 0) {
		return res.status(400).json({
			error: {
				message: "Insira alunos à serem adicionados",
			},
		});
	}

	try {
		for (const aluno of alunos) {
			const { idTurma, nome } = aluno;
			const foundClass = await Turma.findByPk(idTurma, { include: { model: Escola, as: "escola" } });

			if (!foundClass) {
				return res.status(404).json({ error: { message: "Nenhuma turma foi encontrada com este ID" } });
			}

			if (foundClass.dataValues.escola.idGestor !== Number(idUsuario)) {
				return res.status(401).json({
					error: {
						message: `Você não possui autorização para inserir ${nome} nesta turma`,
					},
				});
			}

			await Aluno.create({ nome, idTurma, idEscola: foundClass.dataValues.idEscola });
		}

		return res.status(201).json({ error: null });
	} catch (error) {
		return res.status(500).json({ error });
	}
};
module.exports = CreateAlunosController;
