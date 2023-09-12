const Chamada = require("../../../database/models/Chamada");
const Disciplina = require("../../../database/models/Disciplina");
const Escola = require("../../../database/models/Escola");
/** @type {import("express").RequestHandler}  */
const DeleteChamadaController = async (req, res) => {
  const { idUsuario } = req.userData;
  const { idChamada } = req.params;

  try {
    await Chamada.destroy({ where: { idChamada } });
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

module.exports = DeleteChamadaController;
