const Escola = require("../../../database/models/Escola");
const Turma = require("../../../database/models/Turma");
/** @type {import("express").RequestHandler}  */
const DeleteTurmasController = async (req, res) => {
  const { idUsuario } = req.userData;
  const { idTurma } = req.params;

  if (!idTurma || isNaN(Number(idTurma))) {
    return res.status(400).json({
      error: {
        message: "Dados inválidos para realizar esta ação",
      },
    });
  }

  try {
    const requestedClass = await Turma.findByPk(Number(idTurma), {
      include: { model: Escola, as: "escola", attributes: ["idGestor"] },
    });

    if (!requestedClass) {
      return res.status(404).json({
        error: {
          message: "Nehuma turma foi encontrada com este ID",
        },
      });
    }

    if (requestedClass.dataValues.escola.idGestor !== Number(idUsuario)) {
      return res.status(401).json({
        error: {
          message: "Voce não possui permissão para realizar esta ação",
        },
      });
    }

    await requestedClass.destroy();
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
