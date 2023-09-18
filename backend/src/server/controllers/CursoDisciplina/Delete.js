const CursoDisciplina = require("../../../database/models/CursoDisciplina");
const Disciplina = require("../../../database/models/Disciplina");
const Escola = require("../../../database/models/Escola");
/** @type {import("express").RequestHandler}  */
const DeleteCursoDisciplinasController = async (req, res) => {
  const { idUsuario } = req.userData;
  const { idDisciplina, idCurso } = req.params;
  console.log(idCurso, idDisciplina);
  if (!idCurso || isNaN(Number(idCurso))) {
    return res.status(400).json({});
  }
  if (!idDisciplina || isNaN(Number(idDisciplina))) {
    return res.status(400).json({});
  }
  try {
    const foundObject = await CursoDisciplina.findOne({
      attributes: ["idDisciplina", "idCurso"],
      where: { idDisciplina, idCurso },
      include: [
        {
          model: Disciplina,
          as: "disciplina",
          include: [{ model: Escola, as: "escola", attributes: ["idGestor"] }],
        },
      ],
    });

    if (!foundObject) {
      return res.status(404).json({});
    }

    if (foundObject.dataValues.disciplina.escola.idGestor !== idUsuario) {
      return res.status(401).json({});
    }
    await foundObject.destroy();

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

module.exports = DeleteCursoDisciplinasController;
