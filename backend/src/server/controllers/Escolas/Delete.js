const Escola = require("../../../database/models/Escola");
/** @type {import("express").RequestHandler}  */
const DeleteEscolasController = async (req, res) => {
  const { idUsuario } = req.userData;
  const { idEscola } = req.params;

  if (!idEscola) {
    return res.status(400).json({
      error: {
        message: "Dados insuficientes para realizar esta ação",
      },
    });
  }

  try {
    const foundSchool = await Escola.findOne({ where: { idGestor: idUsuario, idEscola } });
    if (!foundSchool) {
      return res.status(404).json({
        error: {
          message: "Nenhuma escola foi encontrada",
        },
      });
    }
    await foundSchool.destroy();
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

module.exports = DeleteEscolasController;
