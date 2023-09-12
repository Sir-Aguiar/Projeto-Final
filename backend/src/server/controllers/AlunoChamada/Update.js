const ChamadaAluno = require("../../../database/models/ChamadaAluno");
const Escolas = require("../../../database/models/Escola");
/** @type {import("express").RequestHandler}  */
const UpdateAlunoChamadaController = async (req, res) => {
  const { idUsuario } = req.userData;
  const { idAluno, idChamada } = req.params;
  const { toUpdate } = req.body;

  try {
    await ChamadaAluno.update(toUpdate, { where: { idAluno, idChamada } });
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

module.exports = UpdateAlunoChamadaController;
