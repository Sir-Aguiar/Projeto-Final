const Disciplina = require("../../../database/models/Disciplina");
const Escola = require("../../../database/models/Escola");
/** @type {import("express").RequestHandler}  */
const DeleteDisciplinasController = async (req, res) => {
  const { idUsuario } = req.userData;
  const { idDisciplina } = req.params;

  try {
    const foundDiscipline = await Disciplina.findOne({
      where: { idDisciplina },
      include: { model: Escola, as: "escola", where: { idGestor: idUsuario } },
    });
    if (!foundDiscipline) {
      return res.status(400).json({
        error: {
          message: "Você não tem permissão para realizar esta ação",
        },
      });
    }
    await foundDiscipline.destroy();
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

module.exports = DeleteDisciplinasController;
