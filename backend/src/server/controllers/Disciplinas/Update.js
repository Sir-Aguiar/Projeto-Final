const Disciplina = require("../../../database/models/Disciplina");
const Escola = require("../../../database/models/Escola");
/** @type {import("express").RequestHandler}  */
const UpdateDisciplinasController = async (req, res) => {
  const { idUsuario } = req.userData;
  const { idDisciplina } = req.params;
  const { toUpdate } = req.body;

  if (!idDisciplina || !toUpdate) {
    return res.status(400).json({
      error: {
        message: "Dados insuficientes para realizar esta ação",
      },
    });
  }
  const { nome } = toUpdate;
  if (!nome) {
    return res.status(400).json({
      error: {
        message: "Dados insuficientes para realizar esta ação",
      },
    });
  }
  if (nome.length > 50) {
    return res.status(400).json({
      error: {
        message: "Nome de disciplina deve ser menor que 50 caractéres",
      },
    });
  }
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
    await foundDiscipline.update({ nome });
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

module.exports = UpdateDisciplinasController;
