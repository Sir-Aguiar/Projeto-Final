const Turma = require("../../../database/models/Turma");
const { ClassPopulation, AvarageMonthlyAbsence, ClassInfo } = require("../../use-cases/Stats/ClassStats");
const ServerError = require("../../utils/ServerError");

const { VerifySchoolPermission } = require("../../utils/VerifyPermission");
/** @type {import("express").RequestHandler}  */
const GetTurmaStatsController = async (req, res) => {
	const { idUsuario } = req.userData;
	const { idTurma } = req.query;

	try {
		const populacao = await ClassPopulation(Number(idTurma), Number(idUsuario));
		const media_faltas = await AvarageMonthlyAbsence(Number(idTurma), Number(idUsuario));
		const turma_info = await ClassInfo(Number(idTurma), Number(idUsuario));
		return res.status(200).json({
			populacao,
			media_faltas,
			turma_info,
		});
	} catch (error) {
		if (error instanceof ServerError) {
			const { message, status } = error;
			return res.status(status).json({ error: { message } });
		}
		console.log(error);
		return res.status(500).json({
			error: { message: "Houve um erro desconhecido ao tentar pesquisar turmas" },
		});
	}
};

module.exports = GetTurmaStatsController;
