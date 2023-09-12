const CursoDisciplina = require("../../../database/models/CursoDisciplina");
const Escolas = require("../../../database/models/Escola");
/** @type {import("express").RequestHandler}  */
const UpdateCursoDisciplinaController = async (req, res) => {
  const { idUsuario } = req.userData;
  const { idDisciplina, idCurso } = req.params;
  const { toUpdate } = req.body;

  if (!idDisciplina || !idCurso || !toUpdate) {
    return res.status(400).json({
      error: {
        message: "Dados insuficientes para realizar esta ação",
      },
    });
  }

  const { newCurso, newDisciplina } = toUpdate;

  try {
    await CursoDisciplina.update(
      { idCurso: newCurso, idDisciplina: newDisciplina },
      { where: { idCurso, idDisciplina } },
    );
    return res.status(200).json({ error: null });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: {
        message: error.message,
      },
    });
  }
};

module.exports = UpdateCursoDisciplinaController;
