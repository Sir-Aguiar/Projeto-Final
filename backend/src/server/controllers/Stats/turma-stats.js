const { ClassPopulation, AvarageMonthlyAbsence, ClassInfo } = require("../../use-cases/Stats/ClassStats");

/** @type {import("express").RequestHandler}  */
const GetTurmaStatsController = async (req, res) => {
  const { idTurma } = req.query;

  try {
    const TurmaPopulacao = await ClassPopulation(Number(idTurma));
    const FaltasMedia = await AvarageMonthlyAbsence(Number(idTurma));
    const turma_info = await ClassInfo(Number(idTurma));
    return res.status(200).json({
      populacao: TurmaPopulacao,
      media_faltas: FaltasMedia,
      turma_info,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};

module.exports = GetTurmaStatsController;
