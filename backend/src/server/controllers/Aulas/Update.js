const Aula = require("../../../database/models/Aula");
const Disciplina = require("../../../database/models/Disciplina");
const Escola = require("../../../database/models/Escola");
/** @type {import("express").RequestHandler}  */
const UdpateAulasController = async (req, res) => {
  const { idUsuario } = req.userData;
  const { idAula } = req.params;
  const { toUpdate } = req.body;

  if (!idAula || !toUpdate) {
    return res.status(400).json({
      error: {
        message: "Dados insuficientes para realizar esta ação",
      },
    });
  }

  try {
    await Aula.update(toUpdate, { where: { idAula } });
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

module.exports = UdpateAulasController;
