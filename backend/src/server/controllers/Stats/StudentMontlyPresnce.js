const FindStudentById = require("../../use-cases/Alunos/FindById");
const {
  MonthAbscence,
  AvarageMonthAbscenceInCourse,
  MonthlyAbsence,
  TotalAbscence,
} = require("../../use-cases/Stats/MonthPresence");

/** @type {import("express").RequestHandler}  */
const MonthlyPresenceController = async (req, res) => {
  let { idAluno, month } = req.query;

  const CurrentDate = new Date();

  if (!month) month = CurrentDate.getMonth();
  month = Number(month)
  try {
    const aluno = await FindStudentById(Number(idAluno));

    const faltas_mes = await MonthAbscence(aluno.idAluno, month);

    const media_falta_mes = await AvarageMonthAbscenceInCourse(aluno.turma.curso.idCurso, month);

    const faltas_ano = await MonthlyAbsence(Number(idAluno));
    const faltas_total = await TotalAbscence(Number(idAluno));

    return res.status(200).json({
      aluno,
      faltas_ano,
      media_falta_mes,
      faltas_mes,
      faltas_total,
    });
  } catch (error) {
    res.status(500).json({ error });
    console.log(error);
  }
};

module.exports = MonthlyPresenceController;