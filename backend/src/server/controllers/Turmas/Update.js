const { ValidationError } = require("sequelize");
const Escola = require("../../../database/models/Escola");
const Turma = require("../../../database/models/Turma");
/** @type {import("express").RequestHandler}  */
const UpdateTurmaController = async (req, res) => {
  const { idUsuario } = req.userData;
  const { idTurma } = req.params;
  const { toUpdate } = req.body;

  if (!idTurma || isNaN(Number(idTurma))) {
    return res.status(400).json({
      error: {
        message: "Dados inválidos para realizar esta ação",
      },
    });
  }

  if (!toUpdate) {
    return res.status(400).json({
      error: {
        message: "Dados insuficientes para realizar esta ação",
      },
    });
  }

  const { nome, idCurso } = toUpdate;

  if (!nome || nome.length > 15 || !idCurso || isNaN(Number(idCurso))) {
    return res.status(400).json({
      error: {
        message: "Nome de turma inválido",
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
      await requestedClass.update({ nome, idCurso: Number(idCurso) }, { where: { idTurma } });
      return res.status(200).json({ error: null });
    }

    return res.status(400).json({
      error: {
        message: "Você não possui permissão para fazer isto",
      },
    });
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(404).json({
        error: {
          message: error.errors[0].message,
        },
      });
    }
    return res.status(500).json(error);
  }
};

module.exports = UpdateTurmaController;
