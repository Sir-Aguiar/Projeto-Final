const Escola = require("../../../database/models/Escola");
const Turma = require("../../../database/models/Turma");
/** @type {import("express").RequestHandler}  */
const CreateEscolasController = async (req, res) => {
  const { idProfessor } = req.userData;
  const { nome, turmas } = req.body;
  try {
    const created = await Escola.create({ idProfessor, nome });
    if (turmas && turmas.length > 0) {
      for (const turma of turmas) {
        await Turma.create({ nome: turma.nome, idSerie: turma.idSerie, idEscola: created.dataValues.idEscola });
      }
    }
    return res.status(201).json({ error: null, created });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: {
        message: error.message,
      },
    });
  }
};

module.exports = CreateEscolasController;
