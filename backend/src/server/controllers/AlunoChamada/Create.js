const Escola = require("../../../database/models/Escola");
const Disciplina = require("../../../database/models/Disciplina");
const ChamadaAluno = require("../../../database/models/ChamadaAluno");
/** @type {import("express").RequestHandler}  */
const CreateAlunoChamadaController = async (req, res) => {
  const { idUsuario } = req.userData;
  const { idChamada, idAluno, situacao } = req.body;
  try {
    await ChamadaAluno.create({ idAluno, idChamada, situacao });
    return res.status(201).json({ error: null });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: {
        message: error.message,
      },
    });
  }
};

module.exports = CreateAlunoChamadaController;
