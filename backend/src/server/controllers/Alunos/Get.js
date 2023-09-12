const { json } = require("sequelize");
const Aluno = require("../../../database/models/Aluno");
const Escola = require("../../../database/models/Escola");
const Turma = require("../../../database/models/Turma");

/** @type {import("express").RequestHandler}  */
const GetAlunosController = async (req, res) => {
  const { idUsuario } = req.userData;
  const { idTurma } = req.params;

  if (idTurma && isNaN(idTurma)) {
    return res.status(400).json({
      error: {
        message: "Dados inválidos para realizar esta ação",
      },
    });
  }

  try {
    const alunos = await Aluno.findAll({ where: { idTurma } });
    return res.status(200).json({ error: null, alunos });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};

module.exports = GetAlunosController;
