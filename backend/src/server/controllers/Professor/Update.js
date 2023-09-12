const ProfessorLeciona = require("../../../database/models/ProfessorLeciona");
const Escolas = require("../../../database/models/Escola");
/** @type {import("express").RequestHandler}  */
const UpdateProfessorLecionaController = async (req, res) => {
  const { idUsuario } = req.userData;
  const { idDisciplina, idTurma, idProfessor } = req.params;
  const { toUpdate } = req.body;

  if (!idDisciplina || !idTurma || !idProfessor || !toUpdate) {
    return res.status(400).json({
      error: {
        message: "Dados insuficientes para realizar esta ação",
      },
    });
  }

  try {
    await ProfessorLeciona.update(toUpdate, { where: { idTurma, idProfessor, idDisciplina } });
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

module.exports = UpdateProfessorLecionaController;
