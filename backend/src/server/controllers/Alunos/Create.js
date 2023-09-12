const Aluno = require("../../../database/models/Aluno");
const Escola = require("../../../database/models/Escola");
const Turma = require("../../../database/models/Turma");
/** @type {import("express").RequestHandler}  */
const CreateAlunosController = async (req, res) => {
  const { idUsuario } = req.userData;
  const { nome, idTurma, idEscola } = req.body;

  if (!nome || !idTurma || isNaN(Number(idTurma))) {
    return res.status(400).json({
      error: {
        message: "Dados insuficientes ou inválidos para realizar esta ação",
      },
    });
  }

  if (nome.length > 50) {
    return res.status(400).json({
      error: {
        message: "Nome do aluno deve ter no máximo 50 caracteres",
      },
    });
  }

  try {
    await Aluno.create({ nome, idTurma, idEscola });
    return res.status(201).json({ error: null });
  } catch (error) {
    return res.status(500).json({ error });
  }
};
module.exports = CreateAlunosController;
