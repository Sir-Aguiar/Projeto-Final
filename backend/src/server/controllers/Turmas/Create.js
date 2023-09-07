const { ValidationError } = require("sequelize");
const Escola = require("../../../database/models/Escola");
const Turma = require("../../../database/models/Turma");
/** @type {import("express").RequestHandler}  */
const CreateTurmaController = async (req, res) => {
  const { idProfessor } = req.userData;
  const { idEscola, idSerie } = req.params;
  const { nome } = req.body;

  if (!idEscola || !idSerie || !nome) {
    return res.status(400).json({
      error: {
        message: "Dados insuficientes para realizar esta ação",
      },
    });
  }

  if (isNaN(Number(idEscola))) {
    return res.status(400).json({
      error: {
        message: "Dados inválidos para realizar esta ação",
      },
    });
  }

  if (nome.length > 15) {
    return res.status(400).json({
      error: {
        message: "Nome de turma deve ter no máximo 15 caractéres",
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

    // Insere no banco
    const insertedObject = await Turma.create({ nome, idSerie, idEscola });

    return res.status(201).json({ error: null, insertedObject });
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

module.exports = CreateTurmaController;
