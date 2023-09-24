const { ClassPopulation, AvarageMonthlyAbsence } = require("../../use-cases/Stats/ClassStats");

/** @type {import("express").RequestHandler}  */
const GetTurmaStatsController = async (req, res) => {
  const { idTurma } = req.query;

  try {
    const TurmaPopulacao = await ClassPopulation(Number(idTurma));
    const FaltasMedia = await AvarageMonthlyAbsence(idTurma);
    return res.status(200).json({
      populacao: TurmaPopulacao,
      media_faltas: FaltasMedia,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};

module.exports = GetTurmaStatsController;
