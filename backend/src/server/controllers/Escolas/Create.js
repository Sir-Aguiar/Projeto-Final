const Escola = require("../../../database/models/Escola");
const Turma = require("../../../database/models/Turma");
/** @type {import("express").RequestHandler}  */
const CreateEscolasController = async (req, res) => {
  const { idUsuario } = req.userData;
  const { nome, turmas } = req.body;
  try {
    const created = await Escola.create({ idGestor: idUsuario, nome });

    if (turmas && turmas.length > 0) {
      for (const turma of turmas) {
        const { idCurso, nome } = turma;
        await Turma.create({ idCurso, idEscola: created.dataValues.idEscola, nome });
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
