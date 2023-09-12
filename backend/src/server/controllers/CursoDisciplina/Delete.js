const CursoDisciplina = require("../../../database/models/CursoDisciplina");
const Disciplina = require("../../../database/models/Disciplina");
const Escola = require("../../../database/models/Escola");
/** @type {import("express").RequestHandler}  */
const DeleteCursoDisciplinasController = async (req, res) => {
  const { idUsuario } = req.userData;
  const { idDisciplina, idCurso } = req.params;

  try {
    const foundObject = await CursoDisciplina.destroy({ where: { idDisciplina, idCurso } });
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
