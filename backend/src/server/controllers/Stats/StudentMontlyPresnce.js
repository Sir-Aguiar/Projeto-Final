const FindStudentById = require("../../use-cases/Alunos/FindById");
const {
	MonthAbscence,
	AvarageMonthAbscenceInCourse,
	MonthlyAbsence,
	TotalAbscence,
} = require("../../use-cases/Stats/MonthPresence");
const ServerError = require("../../utils/ServerError");

/** @type {import("express").RequestHandler}  */
const MonthlyPresenceController = async (req, res) => {
	const { idUsuario } = req.userData;
	let { idAluno, month } = req.query;

	const CurrentDate = new Date();

	if (!month) month = CurrentDate.getMonth();
	month = Number(month);

	try {
		const aluno = await FindStudentById(Number(idAluno), Number(idUsuario));

		const faltas_mes = await MonthAbscence(month, Number(aluno.idAluno), Number(idUsuario));

		const media_falta_mes = await AvarageMonthAbscenceInCourse(month, Number(aluno.idAluno), Number(idUsuario));

		const faltas_ano = await MonthlyAbsence(Number(aluno.idAluno), Number(idUsuario));
		const faltas_total = await TotalAbscence(Number(aluno.idAluno), Number(idUsuario));

		return res.status(200).json({
			aluno,
			faltas_ano,
			media_falta_mes,
			faltas_mes,
			faltas_total,
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

module.exports = MonthlyPresenceController;
