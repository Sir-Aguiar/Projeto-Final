const Aluno = require("../../../database/models/Aluno");
const Escola = require("../../../database/models/Escola");
const Turma = require("../../../database/models/Turma");
/** @type {import("express").RequestHandler}  */
const UpdateAlunosController = async (req, res) => {
  const { idUsuario } = req.userData;
  const { idAluno } = req.params;
  const { toUpdate } = req.body;

  try {
    await Aluno.update(toUpdate, {
      where: { idAluno },
    });
    return res.status(201).json({ error: null });
  } catch (error) {
    return res.status(500).json({ error });
  }
};
module.exports = UpdateAlunosController;
