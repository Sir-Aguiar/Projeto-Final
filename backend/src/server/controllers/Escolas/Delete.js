const Escolas = require("../../../database/models/Escola");
/** @type {import("express").RequestHandler}  */
const DeleteEscolasController = async (req, res) => {
  const { idProfessor } = req.userData;
  const { idEscola } = req.params;

  if (!idEscola) {
    return res.status(400).json({
      error: {
        message: "Dados insuficientes para realizar esta ação",
      },
    });
  }

  try {
    await Escolas.destroy({
      where: { idProfessor, idEscola },
    });
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
