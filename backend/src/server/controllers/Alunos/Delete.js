const { json } = require("sequelize");
const Aluno = require("../../../database/models/Aluno");
const Escola = require("../../../database/models/Escola");
const Turma = require("../../../database/models/Turma");

/** @type {import("express").RequestHandler}  */
const DeleteAlunosController = async (req, res) => {
  const { idUsuario } = req.userData;
  const { idAluno } = req.params;

  if (idAluno && isNaN(idAluno)) {
    return res.status(400).json({
      error: {
        message: "Dados inválidos para realizar esta ação",
      },
    });
  }

  try {
    await Aluno.destroy({ where: { idAluno } });
    return res.status(200).json({ error: null });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};

module.exports = DeleteAlunosController;
