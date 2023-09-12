const { ValidationError } = require("sequelize");
const Escola = require("../../../database/models/Escola");
const Turma = require("../../../database/models/Turma");
/** @type {import("express").RequestHandler}  */
const CreateTurmaController = async (req, res) => {
  const { idUsuario } = req.userData;
  const { idEscola, idCurso } = req.params;
  const { nome } = req.body;

  if (!nome) {
    return res.status(400).json({
      error: {
        message: "É necessário atribuir um nome à turma",
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

  if (isNaN(Number(idEscola))) {
    return res.status(400).json({
      error: {
        message: "Dados inválidos para realizar esta ação",
      },
    });
  }

  try {
    // Verifica permissão do usuário
    const schoolExists = await Escola.findOne({
      where: { idEscola, idGestor: idUsuario },
    });

    if (!schoolExists) {
      return res.status(404).json({
        error: {
          message: "Nenhuma escola foi encontrada com este ID",
        },
      });
    }

    // Insere no banco
    const insertedObject = await Turma.create({ nome, idCurso, idEscola });

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
