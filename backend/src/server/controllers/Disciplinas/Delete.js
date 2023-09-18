const Disciplina = require("../../../database/models/Disciplina");
const Escola = require("../../../database/models/Escola");
/** @type {import("express").RequestHandler}  */
const DeleteDisciplinasController = async (req, res) => {
  const { idUsuario } = req.userData;
  const { idDisciplina } = req.params;

  try {
    const foundDiscipline = await Disciplina.findOne({
      where: { idDisciplina },
      include: { model: Escola, as: "escola" },
    });

    if (!foundDiscipline) {
      return res.status(404).json({
        error: {
          message: "Disciplina não encontrada",
        },
      });
    }
    if (foundDiscipline.dataValues.escola.idGestor !== idUsuario) {
      return res.status(401).json({
        error: {
          message: "Você não possui permissão para fazer isto.",
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
