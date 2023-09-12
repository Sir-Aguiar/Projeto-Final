const { json } = require("sequelize");
const Escola = require("../../../database/models/Escola");
const Turma = require("../../../database/models/Turma");
/** @type {import("express").RequestHandler}  */
const DeleteTurmasController = async (req, res) => {
  const { idUsuario } = req.userData;
  const { idTurma } = req.params;

  if (isNaN(Number(idTurma))) {
    return res.status(400).json({
      error: {
        message: "Dados inválidos para realizar esta ação",
      },
    });
  }

  try {
    const requestedClass = await Turma.findByPk(Number(idTurma));

    if (!requestedClass) {
      return res.status(404).json({
        error: {
          message: "Nenhuma turma encontrada com este ID",
        },
      });
    }

    const requestedSchool = await Escola.findByPk(requestedClass.dataValues.idEscola);

    if (requestedSchool.dataValues.idGestor == idUsuario) {
      await requestedClass.destroy();
      return res.status(200).json({ error: null });
    }

    return res.status(400).json({
      error: {
        message: "Você não possui permissão para fazer isto",
      },
    });
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
