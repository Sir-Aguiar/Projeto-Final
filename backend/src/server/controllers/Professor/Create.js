const Escola = require("../../../database/models/Escola");
const ProfessorLeciona = require("../../../database/models/ProfessorLeciona");
const Turma = require("../../../database/models/Turma");
/** @type {import("express").RequestHandler}  */
const CreateProfessorController = async (req, res) => {
  const { idUsuario } = req.userData;
  const { idTurma, idDisciplina, idProfessor } = req.body;

  if (!idTurma || !idDisciplina || !idProfessor) {
    return res.status(400).json({
      error: {
        message: "Dados insuficientes para completar esta ação",
      },
    });
  }

  if (isNaN(Number(idTurma)) || isNaN(Number(idDisciplina)) || isNaN(Number(idProfessor))) {
    return res.status(400).json({
      error: {
        message: "Dados inválidos para completar esta ação",
      },
    });
  }

  try {
    await ProfessorLeciona.create({ idDisciplina, idProfessor, idTurma });
    return res.status(201).json({ error: null });
  } catch (error) {
    return res.status(500).json(error);
  }
};

module.exports = CreateProfessorController;
