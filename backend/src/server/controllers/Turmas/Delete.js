const Escola = require("../../../database/models/Escola");
const Turma = require("../../../database/models/Turma");
/** @type {import("express").RequestHandler}  */
const DeleteTurmasController = async (req, res) => {
  const { idProfessor } = req.userData;
  const { idTurma, idEscola } = req.params;

  if (!idTurma || !idEscola) {
    return res.status(400).json({
      error: {
        message: "Dados insuficientes para realizar esta ação",
      },
    });
  }

  try {
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

    await Turma.destroy({
      where: { idTurma },
    });
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

module.exports = DeleteTurmasController;
