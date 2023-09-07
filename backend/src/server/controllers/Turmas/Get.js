const Escola = require("../../../database/models/Escola");
const Turma = require("../../../database/models/Turma");
/** @type {import("express").RequestHandler}  */
const GetTurmasController = async (req, res) => {
  const { idEscola, idSerie } = req.params;
  const { idProfessor } = req.userData;

  try {
    if (idEscola) {
      // Verifica permissão do usuário
      const schoolExists = await Escola.findOne({
        where: { idEscola, idProfessor },
      });

      if (!schoolExists) {
        return res.status(404).json({
          error: {
            message: "Nenhuma escola foi encontrada com este ID",
          },
        });
      }
      // Todas turmas da série
      if (idSerie) {
        const turmas = await Turma.findAll({ where: { idEscola, idSerie } });
        return res.status(200).json({ error: null, turmas });
      }
      // Todas turmas da escola
      const turmas = await Turma.findAll({ where: { idEscola } });
      return res.status(200).json({ error: null, turmas });
    }

    // Todas escolas do professor
    const allSchools = await Escola.findAll({ where: { idProfessor } });

    if (allSchools.length === 0) {
      return res.status(404).json({
        error: {
          message: "Nenhuma escola foi encontrada para este professor",
        },
      });
    }

    const turmas = [];

    // Cada escola
    for (const escola of allSchools) {
      const { idEscola } = escola.dataValues;
      // Todas turmas da escola
      const Turmas = (await Turma.findAll({ where: { idEscola } })).map((turma) => turma.dataValues);

      // Cada turma
      for (const turma of Turmas) {
        turmas.push(turma);
      }
    }

    return res.status(200).json({ error: null, turmas });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

module.exports = GetTurmasController;
