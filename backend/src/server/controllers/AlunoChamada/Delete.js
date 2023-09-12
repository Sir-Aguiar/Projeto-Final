const ChamadaAluno = require("../../../database/models/ChamadaAluno");
const Disciplina = require("../../../database/models/Disciplina");
const Escola = require("../../../database/models/Escola");
/** @type {import("express").RequestHandler}  */
const DeleteAlunoChamadaController = async (req, res) => {
  const { idUsuario } = req.userData;
  const { idAluno, idChamada } = req.params;

  try {
    await ChamadaAluno.destroy({ where: { idAluno, idChamada } });
    return res.status(200).json({ error: null });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: {
        message: error.message,
      },
    });
  }
};

module.exports = DeleteAlunoChamadaController;
