const ProfessorLeciona = require("../../../database/models/ProfessorLeciona");
const Disciplina = require("../../../database/models/Disciplina");
const Escola = require("../../../database/models/Escola");
/** @type {import("express").RequestHandler}  */
const DeleteProfessorLecionaController = async (req, res) => {
  const { idUsuario } = req.userData;
  const { idDisciplina, idTurma, idProfessor } = req.params;

  try {
    await ProfessorLeciona.destroy({ where: { idDisciplina, idTurma, idProfessor } });
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

module.exports = DeleteProfessorLecionaController;
