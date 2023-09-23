const FindStudentById = require("../../use-cases/Alunos/FindById");
const {
  MonthlyPresence,
  MonthPresence,
  AvarageMonthPresenceInCourse,
  TotalPresence,
  PersenceByDisciplines,
} = require("../../use-cases/Stats/MonthPresence");

/** @type {import("express").RequestHandler}  */
const MonthlyPresenceController = async (req, res) => {
  const { idAluno } = req.query;

  try {
    const aluno = await FindStudentById(Number(idAluno));
    const CurrentMonth = new Date().getMonth();
    const CurrentMonthPresence = await MonthPresence(aluno.idAluno, CurrentMonth);

    const AvarageMonthPresence = await AvarageMonthPresenceInCourse(aluno.turma.curso.idCurso, CurrentMonth);

    const Monthly = await MonthlyPresence(Number(idAluno));
    const Total = await TotalPresence(Number(idAluno));

    const DisciplinesPresence = await PersenceByDisciplines(Number(idAluno), CurrentMonth);
    return res.status(200).json({
      aluno,
      media_comparacao: {
        faltas: CurrentMonthPresence,
        media: AvarageMonthPresence,
      },
      faltas_ano: Monthly,
      falta_media_mes: AvarageMonthPresence,
      faltas_mes: CurrentMonthPresence,
      faltas_total: Total,
      disciplinas: DisciplinesPresence,
    });
  } catch (error) {}
};

module.exports = MonthlyPresenceController;
