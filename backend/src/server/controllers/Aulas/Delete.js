const Aula = require("../../../database/models/Aula");
const Disciplina = require("../../../database/models/Disciplina");
const Escola = require("../../../database/models/Escola");
/** @type {import("express").RequestHandler}  */
const DeleteAulasController = async (req, res) => {
  const { idUsuario } = req.userData;
  const { idAula } = req.params;

  try {
    await Aula.destroy({
      where: {
        idAula,
      },
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

module.exports = DeleteAulasController;
