const Escola = require("../../../database/models/Escola");
const Disciplina = require("../../../database/models/Disciplina");
const CursoDisciplina = require("../../../database/models/CursoDisciplina");
/** @type {import("express").RequestHandler}  */
const CreateCursoDisciplinaController = async (req, res) => {
  const { idUsuario } = req.userData;
  const { idCurso, idDisciplina } = req.body;
  try {
    const foundDiscipline = Disciplina.findOne({
      where: { idDisciplina },
      include: { model: Escola, as: "escola", where: { idGestor: idUsuario } },
    });

    if (!foundDiscipline) {
      return res.status(400).json({
        error: {
          message: "Você não possui permissão para fazer isto",
        },
      });
    }

    await CursoDisciplina.create({ idCurso, idDisciplina });
    return res.status(201).json({ error: null });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: {
        message: error.message,
      },
    });
  }
};

module.exports = CreateCursoDisciplinaController;
