const { json } = require("sequelize");
const Aluno = require("../../../database/models/Aluno");
const Escola = require("../../../database/models/Escola");
const Turma = require("../../../database/models/Turma");

/* 
  Se existir idEscola -> Todos os alunos daquela escola
    Se existir idSerie -> Todos os alunos daquela série e escola
  Se existir idTurma -> Todos os alunos daquela turma
*/

/** @type {import("express").RequestHandler}  */
const GetAlunosController = async (req, res) => {
	const { idProfessor } = req.userData;
	const { idEscola, idSerie, idTurma } = req.query;

	if ((idTurma && isNaN(idTurma)) || (idEscola && isNaN(idEscola))) {
		return res.status(400).json({
			error: {
				message: "Dados inválidos para realizar esta ação",
			},
		});
	}

	try {
		// Todos alunos de uma turma
		if (idTurma) {
			// Permissão do usuário
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

			if (!studentSchool) {
				return res.status(400).json({
					error: {
						message: "Você não possui permissão de acessar esta turma",
					},
				});
			}

			const result = await Aluno.findAll({ where: { idTurma } });
			return res.status(200).json({ result });
		}
		// Todos alunos de uma série de uma escola
		if (idSerie && idEscola) {
			const result = await Turma.findAll({ where: { idEscola, idSerie }, include: [{ model: Aluno, as: "alunos" }] });
			res.status(200).json({ result });
		}

		// Todos os alunos de um professor
		const result = await Escola.findAll({
			where: { idProfessor: Number(idProfessor) },
			include: [
				{
					model: Turma,
					as: "turmas",
					include: [{ model: Aluno, as: "alunos" }],
				},
			],
		});

		return res.status(200).json({ result });
	} catch (error) {
		console.log(error);
		res.status(500).json({ error });
	}
};

module.exports = GetAlunosController;
